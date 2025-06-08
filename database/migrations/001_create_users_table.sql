-- Migration: Create Users Table
-- Version: 001
-- Date: 2024-01-01
-- Description: Initial users table with authentication and profile fields

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile Information
    avatar_public_id VARCHAR(255),
    avatar_url VARCHAR(500),
    
    -- Account Status
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'deactivated', 'pending')),
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Security
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expire TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    lock_until TIMESTAMP,
    
    -- Subscription
    subscription_plan VARCHAR(20) DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'enterprise')),
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    subscription_is_active BOOLEAN DEFAULT TRUE,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    
    -- Preferences
    notifications_email BOOLEAN DEFAULT TRUE,
    notifications_push BOOLEAN DEFAULT TRUE,
    notifications_sms BOOLEAN DEFAULT FALSE,
    notifications_job_alerts BOOLEAN DEFAULT TRUE,
    notifications_learning_reminders BOOLEAN DEFAULT TRUE,
    notifications_marketing BOOLEAN DEFAULT FALSE,
    
    privacy_profile_visibility VARCHAR(20) DEFAULT 'private' CHECK (privacy_profile_visibility IN ('public', 'private', 'connections')),
    privacy_data_sharing BOOLEAN DEFAULT FALSE,
    privacy_show_salary BOOLEAN DEFAULT TRUE,
    privacy_show_location BOOLEAN DEFAULT TRUE,
    
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Social Profiles
    social_linkedin_url VARCHAR(500),
    social_linkedin_verified BOOLEAN DEFAULT FALSE,
    social_github_url VARCHAR(500),
    social_github_username VARCHAR(100),
    social_github_verified BOOLEAN DEFAULT FALSE,
    social_portfolio_url VARCHAR(500),
    social_website_url VARCHAR(500),
    social_twitter_url VARCHAR(500),
    social_stackoverflow_url VARCHAR(500),
    
    -- Analytics
    analytics_profile_views INTEGER DEFAULT 0,
    analytics_career_analysis_count INTEGER DEFAULT 0,
    analytics_last_analysis_date TIMESTAMP,
    analytics_recommendations_accepted INTEGER DEFAULT 0,
    analytics_courses_completed INTEGER DEFAULT 0,
    analytics_job_applications INTEGER DEFAULT 0,
    analytics_skills_assessed INTEGER DEFAULT 0,
    
    -- Security Settings
    security_two_factor_enabled BOOLEAN DEFAULT FALSE,
    security_two_factor_secret VARCHAR(255),
    security_last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Terms and Agreements
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_date TIMESTAMP,
    privacy_policy_accepted BOOLEAN DEFAULT FALSE,
    privacy_policy_accepted_date TIMESTAMP,
    marketing_consent BOOLEAN DEFAULT FALSE,
    marketing_consent_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_password_token);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE users IS 'Main users table storing authentication and profile information';
COMMENT ON COLUMN users.role IS 'User role: user, admin, or premium';
COMMENT ON COLUMN users.status IS 'Account status: active, suspended, deactivated, or pending';
COMMENT ON COLUMN users.subscription_plan IS 'Subscription tier: free, premium, or enterprise';
COMMENT ON COLUMN users.privacy_profile_visibility IS 'Profile visibility: public, private, or connections';

-- Migration completed
INSERT INTO migration_history (version, name, executed_at) 
VALUES ('001', 'create_users_table', CURRENT_TIMESTAMP)
ON CONFLICT (version) DO NOTHING;