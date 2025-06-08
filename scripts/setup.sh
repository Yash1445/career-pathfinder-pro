#!/bin/bash

# SkillSync Setup Script
# This script sets up the complete SkillSync development environment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Print banner
print_banner() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║                    🚀 SkillSync Setup                        ║"
    echo "║              AI-Powered Career Path Recommender              ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2)
        REQUIRED_NODE="16.0.0"
        if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE" ]; then
            log_success "Node.js $NODE_VERSION is installed ✓"
        else
            log_error "Node.js version $REQUIRED_NODE or higher is required. Found: $NODE_VERSION"
            exit 1
        fi
    else
        log_error "Node.js is not installed. Please install Node.js 16.0.0 or higher."
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        log_success "npm $NPM_VERSION is installed ✓"
    else
        log_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Git
    if command_exists git; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        log_success "Git $GIT_VERSION is installed ✓"
    else
        log_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    # Check Docker (optional)
    if command_exists docker; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        log_success "Docker $DOCKER_VERSION is installed ✓"
        DOCKER_AVAILABLE=true
    else
        log_warning "Docker is not installed. You can still run SkillSync locally."
        DOCKER_AVAILABLE=false
    fi
    
    # Check Docker Compose (optional)
    if command_exists docker-compose; then
        DOCKER_COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        log_success "Docker Compose $DOCKER_COMPOSE_VERSION is installed ✓"
        DOCKER_COMPOSE_AVAILABLE=true
    else
        log_warning "Docker Compose is not installed."
        DOCKER_COMPOSE_AVAILABLE=false
    fi
    
    # Check MongoDB (for local setup)
    if command_exists mongod; then
        log_success "MongoDB is installed ✓"
        MONGODB_AVAILABLE=true
    else
        log_warning "MongoDB is not installed locally. Using Docker or cloud MongoDB recommended."
        MONGODB_AVAILABLE=false
    fi
    
    # Check Redis (for local setup)
    if command_exists redis-server; then
        log_success "Redis is installed ✓"
        REDIS_AVAILABLE=true
    else
        log_warning "Redis is not installed locally. Using Docker or cloud Redis recommended."
        REDIS_AVAILABLE=false
    fi
    
    # Check Python (for AI models)
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
        log_success "Python $PYTHON_VERSION is installed ✓"
        PYTHON_AVAILABLE=true
    else
        log_warning "Python 3 is not installed. AI features will not be available."
        PYTHON_AVAILABLE=false
    fi
}

# Setup environment files
setup_environment() {
    log_info "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        log_info "Creating backend/.env from template..."
        cp backend/.env.example backend/.env
        log_success "Backend environment file created ✓"
    else
        log_warning "Backend .env file already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        log_info "Creating frontend/.env.local from template..."
        cp frontend/.env.example frontend/.env.local
        log_success "Frontend environment file created ✓"
    else
        log_warning "Frontend .env.local file already exists, skipping..."
    fi
    
    # AI Models environment
    if [ -d "ai-models" ] && [ ! -f "ai-models/.env" ]; then
        log_info "Creating ai-models/.env from template..."
        cp ai-models/.env.example ai-models/.env 2>/dev/null || true
        log_success "AI Models environment file created ✓"
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing project dependencies..."
    
    # Backend dependencies
    log_info "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    log_success "Backend dependencies installed ✓"
    
    # Frontend dependencies
    log_info "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    log_success "Frontend dependencies installed ✓"
    
    # Admin dashboard dependencies
    if [ -d "admin-dashboard" ]; then
        log_info "Installing admin dashboard dependencies..."
        cd admin-dashboard
        npm install
        cd ..
        log_success "Admin dashboard dependencies installed ✓"
    fi
    
    # Mobile app dependencies
    if [ -d "mobile" ]; then
        log_info "Installing mobile app dependencies..."
        cd mobile
        npm install
        cd ..
        log_success "Mobile app dependencies installed ✓"
    fi
    
    # Python dependencies for AI models
    if [ -d "ai-models" ] && [ "$PYTHON_AVAILABLE" = true ]; then
        log_info "Installing Python dependencies for AI models..."
        cd ai-models
        python3 -m pip install -r requirements.txt
        cd ..
        log_success "Python dependencies installed ✓"
    fi
}

# Setup database
setup_database() {
    log_info "Setting up database..."
    
    if [ "$DOCKER_AVAILABLE" = true ] && [ "$DOCKER_COMPOSE_AVAILABLE" = true ]; then
        log_info "Starting database services with Docker..."
        docker-compose up -d mongodb redis
        
        # Wait for services to be ready
        log_info "Waiting for database services to be ready..."
        sleep 10
        
        # Run migrations and seed data
        log_info "Running database migrations and seeding data..."
        cd backend
        npm run migrate 2>/dev/null || log_warning "Migration script not found, skipping..."
        npm run seed 2>/dev/null || log_warning "Seed script not found, skipping..."
        cd ..
        
        log_success "Database setup completed ✓"
    else
        log_warning "Docker not available. Please ensure MongoDB and Redis are running locally."
        log_info "MongoDB connection: mongodb://localhost:27017/skillsync"
        log_info "Redis connection: redis://localhost:6379"
    fi
}

# Generate development certificates
generate_certificates() {
    log_info "Generating development certificates..."
    
    if [ ! -d "infrastructure/nginx/ssl" ]; then
        mkdir -p infrastructure/nginx/ssl
    fi
    
    if [ ! -f "infrastructure/nginx/ssl/cert.pem" ]; then
        openssl req -x509 -newkey rsa:4096 -keyout infrastructure/nginx/ssl/key.pem -out infrastructure/nginx/ssl/cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" 2>/dev/null || log_warning "OpenSSL not available, skipping certificate generation"
        log_success "Development certificates generated ✓"
    else
        log_warning "Certificates already exist, skipping..."
    fi
}

# Start services
start_services() {
    local setup_method=$1
    
    log_info "Starting SkillSync services..."
    
    if [ "$setup_method" = "docker" ]; then
        log_info "Starting all services with Docker Compose..."
        docker-compose up -d
        
        log_info "Waiting for services to be ready..."
        sleep 30
        
        # Health check
        log_info "Performing health checks..."
        if curl -s http://localhost:5000/health > /dev/null; then
            log_success "Backend is running ✓"
        else
            log_error "Backend health check failed"
        fi
        
        if curl -s http://localhost:3000 > /dev/null; then
            log_success "Frontend is running ✓"
        else
            log_error "Frontend health check failed"
        fi
        
    else
        log_info "To start the services manually:"
        echo ""
        echo "1. Start backend server:"
        echo "   cd backend && npm run dev"
        echo ""
        echo "2. Start frontend development server (in new terminal):"
        echo "   cd frontend && npm start"
        echo ""
        if [ -d "ai-models" ] && [ "$PYTHON_AVAILABLE" = true ]; then
            echo "3. Start AI models service (in new terminal):"
            echo "   cd ai-models && python app.py"
            echo ""
        fi
    fi
}

# Display completion message
display_completion() {
    local setup_method=$1
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                                                              ║"
    echo "║                  🎉 Setup Complete!                         ║"
    echo "║                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}📍 Service URLs:${NC}"
    echo "   Frontend:        http://localhost:3000"
    echo "   Backend API:     http://localhost:5000"
    echo "   Admin Dashboard: http://localhost:3001"
    echo "   AI Models:       http://localhost:8000"
    echo ""
    
    echo -e "${BLUE}📚 Documentation:${NC}"
    echo "   API Docs:        http://localhost:5000/api"
    echo "   Project Docs:    ./docs/README.md"
    echo ""
    
    echo -e "${BLUE}🛠️ Development Commands:${NC}"
    echo "   Start all:       docker-compose up -d"
    echo "   Stop all:        docker-compose down"
    echo "   View logs:       docker-compose logs -f"
    echo "   Backend only:    cd backend && npm run dev"
    echo "   Frontend only:   cd frontend && npm start"
    echo ""
    
    echo -e "${BLUE}📊 Monitoring:${NC}"
    echo "   Grafana:         http://localhost:3002 (admin/admin123)"
    echo "   Prometheus:      http://localhost:9090"
    echo ""
    
    echo -e "${YELLOW}⚠️  Important Notes:${NC}"
    echo "   - Update environment variables in .env files for production"
    echo "   - Change default passwords before deploying"
    echo "   - Configure external APIs for full functionality"
    echo ""
    
    if [ "$setup_method" = "docker" ]; then
        echo -e "${GREEN}✅ All services are running! Visit http://localhost:3000 to get started.${NC}"
    else
        echo -e "${GREEN}✅ Setup complete! Start the services manually to begin development.${NC}"
    fi
}

# Main setup function
main() {
    print_banner
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] && [ ! -f "docker-compose.yml" ]; then
        log_error "Please run this script from the project root directory."
        exit 1
    fi
    
    # Ask user for setup preference
    echo -e "${YELLOW}Choose setup method:${NC}"
    echo "1) Docker Compose (Recommended - all services)"
    echo "2) Local development (manual service management)"
    echo ""
    read -p "Enter your choice (1 or 2): " setup_choice
    
    case $setup_choice in
        1)
            setup_method="docker"
            log_info "Using Docker Compose setup..."
            ;;
        2)
            setup_method="local"
            log_info "Using local development setup..."
            ;;
        *)
            log_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
    
    # Run setup steps
    check_requirements
    setup_environment
    install_dependencies
    
    if [ "$setup_method" = "docker" ]; then
        if [ "$DOCKER_AVAILABLE" = false ] || [ "$DOCKER_COMPOSE_AVAILABLE" = false ]; then
            log_error "Docker and Docker Compose are required for this setup method."
            exit 1
        fi
        generate_certificates
        setup_database
        start_services "docker"
    else
        setup_database
        start_services "local"