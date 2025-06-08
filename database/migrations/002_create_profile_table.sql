-- Migration: Create Profiles Table
-- Version: 002
-- Date: 2024-01-01
-- Description: User profiles with detailed career information

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Information
    headline VARCHAR(120),
    summary TEXT,
    bio VARCHAR(500),
    
    -- Location
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    location_timezone VARCHAR(50),
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    location_remote_preferred BOOLEAN DEFAULT FALSE,
    location_willing_to_relocate BOOLEAN DEFAULT FALSE,
    
    -- Career Information
    experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('entry', 'mid', 'senior', 'lead', 'executive')),
    total_experience_years INTEGER DEFAULT 0,
    total_experience_months INTEGER DEFAULT 0,
    
    -- Current Role
    current_role_title VARCHAR(100),
    current_role_company VARCHAR(100),
    current_role_start_date DATE,
    current_role_department VARCHAR(100),
    current_role_level VARCHAR(20),
    current_salary_amount INTEGER,
    current_salary_currency VARCHAR(3) DEFAULT 'USD',
    current_salary_frequency VARCHAR(10) DEFAULT 'yearly',
    
    -- Career Goals
    career_goals_short_term TEXT,
    career_goals_long_term TEXT,
    career_goals_target_roles TEXT[], -- Array of target roles
    career_goals_target_industries TEXT[], -- Array of target industries
    career_goals_target_companies TEXT[], -- Array of target companies
    
    -- Job Preferences
    job_pref_work_type VARCHAR(20) DEFAULT 'flexible' CHECK (job_pref_work_type IN ('remote', 'onsite', 'hybrid', 'flexible')),
    job_pref_salary_min INTEGER,
    job_pref_salary_max INTEGER,
    job_pref_salary_currency VARCHAR(3) DEFAULT 'USD',
    job_pref_salary_frequency VARCHAR(10) DEFAULT 'yearly',
    job_pref_availability VARCHAR(20) DEFAULT 'not-looking' CHECK (job_pref_availability IN ('immediate', '2weeks', '1month', '3months', 'not-looking')),
    job_pref_willing_to_relocate BOOLEAN DEFAULT FALSE,
    job_pref_preferred_locations TEXT[],
    job_pref_requires_sponsorship BOOLEAN DEFAULT FALSE,
    job_pref_travel_willingness VARCHAR(20) DEFAULT 'occasional' CHECK (job_pref_travel_willingness IN ('none', 'occasional', 'frequent', 'extensive')),
    
    -- Resume Information
    resume_filename VARCHAR(255),
    resume_url VARCHAR(500),
    resume_upload_date TIMESTAMP,
    resume_file_size INTEGER,
    resume_parsed_text TEXT,
    resume_extracted_skills TEXT[],
    
    -- Analytics
    analytics_profile_views INTEGER DEFAULT 0,
    analytics_search_appearances INTEGER DEFAULT 0,
    analytics_contact_requests INTEGER DEFAULT 0,
    analytics_profile_completeness INTEGER DEFAULT 0,
    analytics_skill_endorsements INTEGER DEFAULT 0,
    analytics_project_views INTEGER DEFAULT 0,
    analytics_resume_downloads INTEGER DEFAULT 0,
    
    -- AI Insights
    ai_career_stage VARCHAR(50),
    ai_strength_areas TEXT[],
    ai_improvement_areas TEXT[],
    ai_recommended_skills TEXT[],
    ai_career_path_suggestions TEXT[],
    ai_last_analyzed TIMESTAMP,
    
    -- Settings
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'connections')),
    searchable BOOLEAN DEFAULT TRUE,
    open_to_opportunities BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE(user_id)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('technical', 'soft', 'language', 'tool', 'framework', 'database', 'cloud', 'design', 'management', 'other')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_skills junction table
CREATE TABLE IF NOT EXISTS user_skills (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_of_experience DECIMAL(4,1) DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(profile_id, skill_id)
);

-- Create work_experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    company_size VARCHAR(20) CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+')),
    company_industry VARCHAR(100),
    employment_type VARCHAR(20) DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship', 'volunteer')),
    
    -- Location
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    is_hybrid BOOLEAN DEFAULT FALSE,
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    
    -- Details
    description TEXT,
    responsibilities TEXT[],
    achievements TEXT[],
    skills_used TEXT[],
    technologies TEXT[],
    team_size INTEGER,
    reports_to VARCHAR(100),
    
    -- Salary
    salary_amount INTEGER,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_frequency VARCHAR(10) DEFAULT 'yearly',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution VARCHAR(200) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    grade VARCHAR(20),
    gpa_value DECIMAL(3,2),
    gpa_scale DECIMAL(3,1) DEFAULT 4.0,
    honors TEXT[],
    activities TEXT[],
    description TEXT,
    coursework TEXT[],
    thesis_title VARCHAR(300),
    thesis_description TEXT,
    thesis_advisor VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('web', 'mobile', 'desktop', 'ai-ml', 'data-science', 'devops', 'design', 'research', 'other')),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('planning', 'in-progress', 'completed', 'on-hold', 'cancelled')),
    technologies TEXT[],
    skills TEXT[],
    role VARCHAR(100),
    start_date DATE,
    end_date DATE,
    duration VARCHAR(50),
    url VARCHAR(500),
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    images TEXT[],
    team_size INTEGER,
    my_contribution TEXT,
    key_features TEXT[],
    challenges TEXT,
    results TEXT,
    learnings TEXT[],
    is_open_source BOOLEAN DEFAULT FALSE,
    github_stars INTEGER,
    github_forks INTEGER,
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'portfolio')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    issuer VARCHAR(200) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    verification_url VARCHAR(500),
    skills TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    proficiency VARCHAR(20) CHECK (proficiency IN ('basic', 'conversational', 'fluent', 'native')),
    certified BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(visibility, searchable);
CREATE INDEX IF NOT EXISTS idx_profiles_open_to_opportunities ON profiles(open_to_opportunities);

CREATE INDEX IF NOT EXISTS idx_user_skills_profile_id ON user_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_level ON user_skills(level);

CREATE INDEX IF NOT EXISTS idx_work_experience_profile_id ON work_experience(profile_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_is_current ON work_experience(is_current);
CREATE INDEX IF NOT EXISTS idx_work_experience_company ON work_experience(company);

CREATE INDEX IF NOT EXISTS idx_education_profile_id ON education(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_certifications_profile_id ON certifications(profile_id);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE profiles IS 'Detailed user profiles with career information';
COMMENT ON TABLE user_skills IS 'Junction table for user skills with proficiency levels';
COMMENT ON TABLE work_experience IS 'User work experience history';
COMMENT ON TABLE education IS 'User education background';
COMMENT ON TABLE projects IS 'User projects and portfolio items';
COMMENT ON TABLE certifications IS 'Professional certifications and licenses';
COMMENT ON TABLE languages IS 'Language proficiencies';

-- Migration completed
INSERT INTO migration_history (version, name, executed_at) 
VALUES ('002', 'create_profiles_table', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO NOTHING;