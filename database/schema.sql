-- SkillSync Database Schema (SQL Version for Reference)
-- Note: This is for reference only. The actual implementation uses MongoDB

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expire TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    lock_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    headline VARCHAR(120),
    summary TEXT,
    experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
    total_experience_years DECIMAL(4,1) DEFAULT 0,
    current_role_title VARCHAR(100),
    current_company VARCHAR(100),
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    timezone VARCHAR(50),
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'connections')),
    profile_completeness INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('technical', 'soft', 'language', 'tool', 'framework', 'database', 'cloud', 'other')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills (Many-to-Many relationship)
CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience DECIMAL(4,1) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, skill_id)
);

-- Work Experience
CREATE TABLE work_experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    company_size VARCHAR(20) CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    employment_type VARCHAR(20) DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    grade VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    role VARCHAR(100),
    start_date DATE,
    end_date DATE,
    url VARCHAR(500),
    github_url VARCHAR(500),
    team_size INTEGER,
    challenges TEXT,
    results TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Paths
CREATE TABLE career_paths (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    average_salary INTEGER,
    growth_rate DECIMAL(5,2),
    job_demand VARCHAR(20) CHECK (job_demand IN ('low', 'medium', 'high', 'very-high')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Career Path Steps
CREATE TABLE career_path_steps (
    id SERIAL PRIMARY KEY,
    career_path_id INTEGER REFERENCES career_paths(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
    title VARCHAR(200),
    description TEXT,
    typical_years INTEGER,
    salary_min INTEGER,
    salary_max INTEGER,
    step_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Career Analysis
CREATE TABLE user_career_analysis (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    primary_path_id INTEGER REFERENCES career_paths(id),
    confidence_score DECIMAL(3,2),
    analysis_data JSONB,
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(200) NOT NULL,
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    employment_type VARCHAR(20) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
    experience_level VARCHAR(20) CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    application_url VARCHAR(500),
    external_id VARCHAR(255),
    source VARCHAR(100),
    posted_date DATE,
    expires_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Skills (Many-to-Many)
CREATE TABLE job_skills (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    weight DECIMAL(3,2) DEFAULT 1.0,
    UNIQUE(job_id, skill_id)
);

-- User Job Applications
CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn')),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(user_id, job_id)
);

-- Courses
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    provider VARCHAR(200),
    description TEXT,
    url VARCHAR(500),
    duration_hours INTEGER,
    price DECIMAL(8,2),
    currency VARCHAR(3) DEFAULT 'USD',
    rating DECIMAL(2,1),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    is_free BOOLEAN DEFAULT FALSE,
    language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Course Skills (Many-to-Many)
CREATE TABLE course_skills (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE(course_id, skill_id)
);

-- User Course Progress
CREATE TABLE user_course_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in-progress', 'completed', 'dropped')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    started_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    certificate_url VARCHAR(500),
    UNIQUE(user_id, course_id)
);

-- Analytics and Metrics
CREATE TABLE user_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    profile_views INTEGER DEFAULT 0,
    search_appearances INTEGER DEFAULT 0,
    career_analysis_count INTEGER DEFAULT 0,
    last_analysis_date TIMESTAMP,
    recommendations_accepted INTEGER DEFAULT 0,
    courses_completed INTEGER DEFAULT 0,
    applications_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_password_token);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_jobs_location ON jobs(location_city, location_country);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_posted_date ON jobs(posted_date DESC);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Insert some initial data
INSERT INTO system_settings (key, value, description) VALUES
('app_version', '1.0.0', 'Current application version'),
('maintenance_mode', 'false', 'Whether the app is in maintenance mode'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes'),
('default_currency', 'USD', 'Default currency for salary displays'),
('ai_analysis_enabled', 'true', 'Whether AI career analysis is enabled');

-- Insert common skills
INSERT INTO skills (name, category) VALUES
('JavaScript', 'technical'),
('Python', 'technical'),
('React', 'framework'),
('Node.js', 'technical'),
('SQL', 'database'),
('AWS', 'cloud'),
('Docker', 'tool'),
('Git', 'tool'),
('Communication', 'soft'),
('Leadership', 'soft'),
('Problem Solving', 'soft'),
('Project Management', 'soft');

-- Insert sample career paths
INSERT INTO career_paths (title, description, category, average_salary, growth_rate, job_demand) VALUES
('Frontend Developer', 'Specializes in user interface and user experience development', 'Technology', 75000, 13.0, 'high'),
('Backend Developer', 'Focuses on server-side application logic and infrastructure', 'Technology', 80000, 12.0, 'high'),
('Full Stack Developer', 'Works on both frontend and backend development', 'Technology', 85000, 15.0, 'very-high'),
('Data Scientist', 'Analyzes complex data to help companies make decisions', 'Technology', 95000, 22.0, 'very-high'),
('Product Manager', 'Oversees product development and strategy', 'Management', 110000, 8.0, 'high'),
('UX Designer', 'Designs user experiences for digital products', 'Design', 70000, 10.0, 'medium'),
('DevOps Engineer', 'Bridges development and operations teams', 'Technology', 90000, 18.0, 'very-high'),
('Mobile Developer', 'Creates applications for mobile devices', 'Technology', 78000, 14.0, 'high');

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analytics_updated_at BEFORE UPDATE ON user_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();