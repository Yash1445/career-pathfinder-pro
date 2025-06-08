#!/bin/bash

# SkillSync Database Backup Script
# Description: Automated database backup with rotation and compression
# Usage: ./backup.sh [database_name] [backup_type]

set -e  # Exit on any error

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/backup.log"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$SCRIPT_DIR"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

# Database configuration
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${1:-${POSTGRES_DB:-"skillsync"}}
DB_USER=${POSTGRES_USER:-"skillsync"}
DB_PASSWORD=${POSTGRES_PASSWORD:-""}

# Backup types
BACKUP_TYPE=${2:-"full"}  # full, schema, data

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if required tools are installed
check_dependencies() {
    local missing_deps=()
    
    if ! command -v pg_dump &> /dev/null; then
        missing_deps+=("pg_dump")
    fi
    
    if ! command -v gzip &> /dev/null; then
        missing_deps+=("gzip")
    fi
    
    if ! command -v aws &> /dev/null && [ -n "$AWS_BACKUP_BUCKET" ]; then
        log_warning "AWS CLI not found. S3 backup will be skipped."
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing required dependencies: ${missing_deps[*]}"
        exit 1
    fi
}

# Test database connection
test_connection() {
    log_info "Testing database connection..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
        log_success "Database connection successful"
    else
        log_error "Cannot connect to database $DB_NAME on $DB_HOST:$DB_PORT"
        exit 1
    fi
}

# Create backup directory if it doesn't exist
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# Perform database backup
perform_backup() {
    local backup_file="${DB_NAME}_${BACKUP_TYPE}_${DATE}.sql"
    local compressed_file="${backup_file}.gz"
    local backup_path="$BACKUP_DIR/$backup_file"
    local compressed_path="$BACKUP_DIR/$compressed_file"
    
    log_info "Starting $BACKUP_TYPE backup of database: $DB_NAME"
    log_info "Backup file: $compressed_file"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Set pg_dump options based on backup type
    local pg_dump_options=""
    case "$BACKUP_TYPE" in
        "full")
            pg_dump_options="--verbose --no-password --format=custom --compress=9"
            backup_file="${DB_NAME}_full_${DATE}.dump"
            compressed_file="${backup_file}"
            backup_path="$BACKUP_DIR/$backup_file"
            compressed_path="$backup_path"
            ;;
        "schema")
            pg_dump_options="--verbose --no-password --schema-only"
            ;;
        "data")
            pg_dump_options="--verbose --no-password --data-only"
            ;;
        *)
            log_error "Invalid backup type: $BACKUP_TYPE. Use 'full', 'schema', or 'data'"
            exit 1
            ;;
    esac
    
    # Perform the backup
    if [ "$BACKUP_TYPE" = "full" ]; then
        # Custom format backup (already compressed)
        if pg_dump $pg_dump_options \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$DB_NAME" \
            --file="$compressed_path"; then
            log_success "Database backup completed: $compressed_file"
        else
            log_error "Database backup failed"
            exit 1
        fi
    else
        # SQL format backup (needs compression)
        if pg_dump $pg_dump_options \
            --host="$DB_HOST" \
            --port="$DB_PORT" \
            --username="$DB_USER" \
            --dbname="$DB_NAME" > "$backup_path"; then
            
            # Compress the backup
            log_info "Compressing backup file..."
            if gzip "$backup_path"; then
                log_success "Backup compressed: $compressed_file"
            else
                log_error "Failed to compress backup"
                exit 1
            fi
        else
            log_error "Database backup failed"
            exit 1
        fi
    fi
    
    # Get file size
    local file_size=$(du -h "$compressed_path" | cut -f1)
    log_info "Backup file size: $file_size"
    
    # Upload to S3 if configured
    if [ -n "$AWS_BACKUP_BUCKET" ] && command -v aws &> /dev/null; then
        upload_to_s3 "$compressed_path" "$compressed_file"
    fi
    
    # Create a symlink to latest backup
    create_latest_symlink "$compressed_path" "$BACKUP_TYPE"
    
    echo "$compressed_path"  # Return the backup file path
}

# Upload backup to S3
upload_to_s3() {
    local file_path="$1"
    local file_name="$2"
    local s3_path="s3://$AWS_BACKUP_BUCKET/skillsync/database/$file_name"
    
    log_info "Uploading backup to S3: $s3_path"
    
    if aws s3 cp "$file_path" "$s3_path" --storage-class STANDARD_IA; then
        log_success "Backup uploaded to S3 successfully"
        
        # Tag the S3 object
        aws s3api put-object-tagging \
            --bucket "$AWS_BACKUP_BUCKET" \
            --key "skillsync/database/$file_name" \
            --tagging "TagSet=[{Key=Project,Value=SkillSync},{Key=Type,Value=DatabaseBackup},{Key=Date,Value=$DATE}]" \
            2>/dev/null || log_warning "Failed to tag S3 object"
    else
        log_error "Failed to upload backup to S3"
    fi
}

# Create symlink to latest backup
create_latest_symlink() {
    local backup_path="$1"
    local backup_type="$2"
    local latest_link="$BACKUP_DIR/latest_${backup_type}_backup"
    
    if [ -L "$latest_link" ]; then
        rm "$latest_link"
    fi
    
    ln -s "$(basename "$backup_path")" "$latest_link"
    log_info "Created symlink: latest_${backup_type}_backup -> $(basename "$backup_path")"
}

# Clean up old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    
    # Find and delete old backup files
    while IFS= read -r -d '' file; do
        rm "$file"
        log_info "Deleted old backup: $(basename "$file")"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "${DB_NAME}_*.sql.gz" -o -name "${DB_NAME}_*.dump" -type f -mtime +$RETENTION_DAYS -print0)
    
    if [ $deleted_count -eq 0 ]; then
        log_info "No old backups to clean up"
    else
        log_success "Cleaned up $deleted_count old backup(s)"
    fi
    
    # Clean up S3 if configured
    if [ -n "$AWS_BACKUP_BUCKET" ] && command -v aws &> /dev/null; then
        cleanup_s3_backups
    fi
}

# Clean up old S3 backups
cleanup_s3_backups() {
    log_info "Cleaning up old S3 backups..."
    
    local cutoff_date=$(date -d "$RETENTION_DAYS days ago" '+%Y-%m-%d')
    
    # List and delete old S3 objects
    aws s3api list-objects-v2 \
        --bucket "$AWS_BACKUP_BUCKET" \
        --prefix "skillsync/database/" \
        --query "Contents[?LastModified<='$cutoff_date'].Key" \
        --output text | while read -r key; do
        if [ -n "$key" ] && [ "$key" != "None" ]; then
            aws s3 rm "s3://$AWS_BACKUP_BUCKET/$key"
            log_info "Deleted old S3 backup: $key"
        fi
    done
}

# Generate backup report
generate_report() {
    local backup_file="$1"
    local report_file="$BACKUP_DIR/backup_report_${DATE}.txt"
    
    cat > "$report_file" << EOF
SkillSync Database Backup Report
================================
Date: $(date)
Database: $DB_NAME
Host: $DB_HOST:$DB_PORT
Backup Type: $BACKUP_TYPE
Backup File: $(basename "$backup_file")
File Size: $(du -h "$backup_file" | cut -f1)
Retention: $RETENTION_DAYS days

Backup Status: SUCCESS
Time Completed: $(date)

Database Statistics:
EOF
    
    # Add database statistics
    export PGPASSWORD="$DB_PASSWORD"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
        SELECT 
            schemaname,
            tablename,
            pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
        LIMIT 10;
    " >> "$report_file" 2>/dev/null || echo "Failed to get database statistics" >> "$report_file"
    
    log_info "Backup report generated: $report_file"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log_info "Verifying backup integrity..."
    
    if [ "$BACKUP_TYPE" = "full" ]; then
        # Verify custom format backup
        if pg_restore --list "$backup_file" > /dev/null 2>&1; then
            log_success "Backup integrity verified"
            return 0
        else
            log_error "Backup integrity check failed"
            return 1
        fi
    else
        # Verify compressed SQL backup
        if gzip -t "$backup_file" 2>/dev/null; then
            log_success "Backup integrity verified"
            return 0
        else
            log_error "Backup integrity check failed"
            return 1
        fi
    fi
}

# Send notification (if configured)
send_notification() {
    local status="$1"
    local backup_file="$2"
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        local color="good"
        local message="✅ SkillSync database backup completed successfully"
        
        if [ "$status" != "success" ]; then
            color="danger"
            message="❌ SkillSync database backup failed"
        fi
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [{
                    \"color\": \"$color\",
                    \"title\": \"Database Backup Report\",
                    \"text\": \"$message\",
                    \"fields\": [
                        {\"title\": \"Database\", \"value\": \"$DB_NAME\", \"short\": true},
                        {\"title\": \"Type\", \"value\": \"$BACKUP_TYPE\", \"short\": true},
                        {\"title\": \"File\", \"value\": \"$(basename "$backup_file")\", \"short\": true},
                        {\"title\": \"Date\", \"value\": \"$(date)\", \"short\": true}
                    ]
                }]
            }" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || log_warning "Failed to send Slack notification"
    fi
    
    if [ -n "$EMAIL_NOTIFICATION" ]; then
        local subject="SkillSync Database Backup - $status"
        echo "Database backup $status for $DB_NAME at $(date)" | \
        mail -s "$subject" "$EMAIL_NOTIFICATION" 2>/dev/null || log_warning "Failed to send email notification"
    fi
}

# Show usage information
show_usage() {
    cat << EOF
Usage: $0 [database_name] [backup_type]

Arguments:
  database_name    Name of the database to backup (default: skillsync)
  backup_type      Type of backup: full, schema, data (default: full)

Environment Variables:
  DB_HOST                Database host (default: localhost)
  DB_PORT                Database port (default: 5432)
  DB_USER                Database username
  DB_PASSWORD            Database password
  BACKUP_RETENTION_DAYS  Days to keep backups (default: 30)
  AWS_BACKUP_BUCKET      S3 bucket for backup storage
  SLACK_WEBHOOK_URL      Slack webhook for notifications
  EMAIL_NOTIFICATION     Email address for notifications

Examples:
  $0                           # Backup 'skillsync' database (full backup)
  $0 skillsync schema         # Schema-only backup
  $0 production data          # Data-only backup
EOF
}

# Main execution
main() {
    # Handle help flag
    if [[ "$1" == "-h" || "$1" == "--help" ]]; then
        show_usage
        exit 0
    fi
    
    log_info "Starting SkillSync database backup process"
    log_info "Backup type: $BACKUP_TYPE, Database: $DB_NAME"
    
    # Run backup process
    check_dependencies
    test_connection
    create_backup_dir
    
    local backup_file
    backup_file=$(perform_backup)
    
    if verify_backup "$backup_file"; then
        generate_report "$backup_file"
        cleanup_old_backups
        send_notification "success" "$backup_file"
        log_success "Backup process completed successfully"
        exit 0
    else
        send_notification "failed" "$backup_file"
        log_error "Backup process failed"
        exit 1
    fi
}

# Trap errors and cleanup
trap 'log_error "Backup process interrupted"; exit 1' INT TERM

# Execute main function
main "$@"