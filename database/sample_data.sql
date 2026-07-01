-- Fictional application records for development and testing

INSERT INTO applications (
    company_name,
    role_title,
    job_link,
    location,
    application_status,
    application_date,
    deadline,
    contact_name,
    contact_email,
    notes
)
VALUES
(
    'Sample Bank',
    'Business Analyst Intern',
    'https://example.com/business-analyst-intern',
    'Singapore',
    'Applied',
    '2026-07-01',
    '2026-07-15',
    'Jane Tan',
    'jane.tan@example.com',
    'Submitted through the company career portal.'
),
(
    'Sample FinTech',
    'Product Analyst Intern',
    'https://example.com/product-analyst-intern',
    'Singapore',
    'Interested',
    NULL,
    '2026-07-20',
    NULL,
    NULL,
    'Review the role requirements before applying.'
);