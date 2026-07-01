-- Internship Application Tracker
-- Initial PostgreSQL database schema

CREATE TABLE applications (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_name VARCHAR(150) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    job_link TEXT,
    location VARCHAR(150),
    application_status VARCHAR(50) NOT NULL DEFAULT 'Interested',
    application_date DATE,
    deadline DATE,
    contact_name VARCHAR(150),
    contact_email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);