#!/bin/bash

# Backup directory
BACKUP_DIR="../database/backups"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Get current date and time for backup filename
CURRENT_DATE=$(date +"%Y%m%d_%H%M%S")

# Backup database (replace 'your_database_name' with the actual database name)
# For MySQL
mysqldump -u your_username -p your_database_name > $BACKUP_DIR/backup_$CURRENT_DATE.sql

# For PostgreSQL
# pg_dump -U your_username -d your_database_name -f $BACKUP_DIR/backup_$CURRENT_DATE.sql

# Compress the backup file
gzip $BACKUP_DIR/backup_$CURRENT_DATE.sql

echo "Backup completed successfully: $BACKUP_DIR/backup_$CURRENT_DATE.sql.gz"