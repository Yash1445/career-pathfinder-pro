# Database Schema Documentation

## Users Table
- **user_id**: INT, Primary Key, Auto Increment
- **username**: VARCHAR(50), Unique, Not Null
- **email**: VARCHAR(100), Unique, Not Null
- **password_hash**: VARCHAR(255), Not Null
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Profiles Table
- **profile_id**: INT, Primary Key, Auto Increment
- **user_id**: INT, Foreign Key (references Users)
- **first_name**: VARCHAR(50), Not Null
- **last_name**: VARCHAR(50), Not Null
- **bio**: TEXT
- **avatar_url**: VARCHAR(255)
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## CareerPaths Table
- **career_path_id**: INT, Primary Key, Auto Increment
- **name**: VARCHAR(100), Not Null
- **description**: TEXT
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Skills Table
- **skill_id**: INT, Primary Key, Auto Increment
- **name**: VARCHAR(100), Unique, Not Null
- **category**: VARCHAR(50)
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Jobs Table
- **job_id**: INT, Primary Key, Auto Increment
- **title**: VARCHAR(100), Not Null
- **description**: TEXT
- **requirements**: TEXT
- **salary_range**: VARCHAR(50)
- **career_path_id**: INT, Foreign Key (references CareerPaths)
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Courses Table
- **course_id**: INT, Primary Key, Auto Increment
- **title**: VARCHAR(100), Not Null
- **description**: TEXT
- **provider**: VARCHAR(100)
- **url**: VARCHAR(255)
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Progress Table
- **progress_id**: INT, Primary Key, Auto Increment
- **user_id**: INT, Foreign Key (references Users)
- **course_id**: INT, Foreign Key (references Courses)
- **status**: ENUM('not_started', 'in_progress', 'completed'), Default 'not_started'
- **created_at**: TIMESTAMP, Default CURRENT_TIMESTAMP
- **updated_at**: TIMESTAMP, Default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

## Analytics Table
- **analytics_id**: INT, Primary Key, Auto Increment
- **user_id**: INT, Foreign Key (references Users)
- **action**: VARCHAR(100), Not Null
- **timestamp**: TIMESTAMP, Default CURRENT_TIMESTAMP

This schema provides a comprehensive structure for managing users, their profiles, career paths, skills, job listings, courses, progress tracking, and analytics within the application.