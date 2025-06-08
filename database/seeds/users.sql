-- Seed Users Data
-- Description: Insert sample users for development and testing

-- Insert admin user
INSERT INTO users (
    name, email, password_hash, role, status, is_verified,
    subscription_plan, subscription_is_active,
    terms_accepted, terms_accepted_date,
    privacy_policy_accepted, privacy_policy_accepted_date,
    created_at, updated_at
) VALUES (
    'SkillSync Admin',
    'admin@skillsync.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: admin123
    'admin',
    'active',
    true,
    'enterprise',
    true,
    true,
    CURRENT_TIMESTAMP,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert sample premium user
INSERT INTO users (
    name, email, password_hash, role, status, is_verified,
    subscription_plan, subscription_start_date, subscription_end_date, subscription_is_active,
    social_linkedin_url, social_github_url, social_portfolio_url,
    analytics_profile_views, analytics_career_analysis_count,
    terms_accepted, terms_accepted_date,
    privacy_policy_accepted, privacy_policy_accepted_date,
    created_at, updated_at
) VALUES (
    'John Smith',
    'john.smith@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'premium',
    'active',
    true,
    'premium',
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP + INTERVAL '330 days',
    true,
    'https://linkedin.com/in/johnsmith',
    'https://github.com/johnsmith',
    'https://johnsmith.dev',
    156,
    3,
    true,
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert sample regular users
INSERT INTO users (
    name, email, password_hash, role, status, is_verified,
    subscription_plan, subscription_is_active,
    social_linkedin_url, social_github_url,
    analytics_profile_views, analytics_career_analysis_count,
    terms_accepted, terms_accepted_date,
    privacy_policy_accepted, privacy_policy_accepted_date,
    created_at, updated_at
) VALUES 
(
    'Sarah Johnson',
    'sarah.johnson@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'user',
    'active',
    true,
    'free',
    true,
    'https://linkedin.com/in/sarahjohnson',
    'https://github.com/sarahjohnson',
    89,
    2,
    true,
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    CURRENT_TIMESTAMP
),
(
    'Michael Chen',
    'michael.chen@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'user',
    'active',
    true,
    'free',
    true,
    'https://linkedin.com/in/michaelchen',
    null,
    45,
    1,
    true,
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    CURRENT_TIMESTAMP - INTERVAL '7 days',
    CURRENT_TIMESTAMP
),
(
    'Emily Rodriguez',
    'emily.rodriguez@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'user',
    'active',
    true,
    'premium',
    true,
    'https://linkedin.com/in/emilyrodriguez',
    'https://github.com/emilyrodriguez',
    123,
    4,
    true,
    CURRENT_TIMESTAMP - INTERVAL '45 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '45 days',
    CURRENT_TIMESTAMP - INTERVAL '45 days',
    CURRENT_TIMESTAMP
),
(
    'David Wilson',
    'david.wilson@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'user',
    'active',
    true,
    'free',
    true,
    'https://linkedin.com/in/davidwilson',
    'https://github.com/davidwilson',
    67,
    1,
    true,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP
),
(
    'Lisa Kim',
    'lisa.kim@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe', -- password: password123
    'user',
    'active',
    false, -- Not verified yet
    'free',
    true,
    null,
    null,
    12,
    0,
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    true,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert demo users for different experience levels
INSERT INTO users (
    name, email, password_hash, role, status, is_verified,
    subscription_plan, subscription_is_active,
    analytics_career_analysis_count,
    terms_accepted, terms_accepted_date,
    privacy_policy_accepted, privacy_policy_accepted_date,
    created_at, updated_at
) VALUES 
(
    'Alex Entry',
    'alex.entry@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe',
    'user',
    'active',
    true,
    'free',
    true,
    1,
    true,
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    CURRENT_TIMESTAMP - INTERVAL '10 days',
    CURRENT_TIMESTAMP
),
(
    'Jordan Senior',
    'jordan.senior@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe',
    'user',
    'active',
    true,
    'premium',
    true,
    5,
    true,
    CURRENT_TIMESTAMP - INTERVAL '60 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '60 days',
    CURRENT_TIMESTAMP - INTERVAL '60 days',
    CURRENT_TIMESTAMP
),
(
    'Taylor Lead',
    'taylor.lead@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe',
    'user',
    'active',
    true,
    'enterprise',
    true,
    8,
    true,
    CURRENT_TIMESTAMP - INTERVAL '90 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '90 days',
    CURRENT_TIMESTAMP - INTERVAL '90 days',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Update user analytics for some users
UPDATE users SET 
    analytics_profile_views = FLOOR(RANDOM() * 200) + 50,
    analytics_recommendations_accepted = FLOOR(RANDOM() * 10) + 1,
    analytics_courses_completed = FLOOR(RANDOM() * 5),
    analytics_job_applications = FLOOR(RANDOM() * 15) + 2,
    last_login = CURRENT_TIMESTAMP - INTERVAL '1 day' * FLOOR(RANDOM() * 7)
WHERE email LIKE '%@example.com';

-- Insert some test users with specific characteristics
INSERT INTO users (
    name, email, password_hash, role, status, is_verified,
    subscription_plan, subscription_is_active,
    social_linkedin_url, social_github_url,
    privacy_profile_visibility,
    terms_accepted, terms_accepted_date,
    privacy_policy_accepted, privacy_policy_accepted_date,
    created_at, updated_at
) VALUES 
(
    'Public Profile User',
    'public.user@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe',
    'user',
    'active',
    true,
    'premium',
    true,
    'https://linkedin.com/in/publicuser',
    'https://github.com/publicuser',
    'public', -- Public profile for search testing
    true,
    CURRENT_TIMESTAMP - INTERVAL '20 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '20 days',
    CURRENT_TIMESTAMP - INTERVAL '20 days',
    CURRENT_TIMESTAMP
),
(
    'Private Profile User',
    'private.user@example.com',
    '$2b$12$LQv3c1yqBwEHxE5W8mRL2eFXMUZhIQo3FDZD4t4pN8qY7vNzX1kqe',
    'user',
    'active',
    true,
    'free',
    true,
    null,
    null,
    'private', -- Private profile
    true,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    true,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Display seeded users count
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    RAISE NOTICE 'Successfully seeded % users', user_count;
END $$;