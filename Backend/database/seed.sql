-- Sample data for testing

-- Insert test coverage for user
INSERT INTO coverage (user_id, name, type, "limit", used, remaining, description, icon) VALUES
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Annual Medical', 'Medical', 5000.00, 1250.00, 3750.00, 'General medical services including doctor visits, lab tests, and procedures', 'medical'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Emergency Care', 'Medical', 10000.00, 350.00, 9650.00, 'Emergency room visits and urgent care services', 'emergency'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Prescription Drugs', 'Prescription', 2000.00, 450.00, 1550.00, 'Prescription medications and pharmacy services', 'prescription'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Dental Care', 'Dental', 1500.00, 300.00, 1200.00, 'Dental cleanings, fillings, and basic procedures', 'dental'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Vision Care', 'Vision', 500.00, 150.00, 350.00, 'Eye exams, glasses, and contact lenses', 'vision');

-- Insert test claims
INSERT INTO claims (user_id, claim_number, date, provider, service, amount, status, description, submitted_date) VALUES
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'CLM-2024-0001', '2024-01-15', 'City General Hospital', 'Emergency Room Visit', 850.00, 'Approved', 'Emergency treatment for acute pain', '2024-01-16'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'CLM-2024-0002', '2024-01-20', 'Dr. Smith Clinic', 'Annual Checkup', 200.00, 'Approved', 'Routine annual physical examination', '2024-01-21'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'CLM-2024-0003', '2024-01-25', 'MediLab Testing', 'Blood Work', 150.00, 'Processing', 'Comprehensive blood panel', '2024-01-26');

-- Insert test bills
INSERT INTO bills (user_id, description, amount, due_date, status) VALUES
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Deductible - Emergency Room Visit', 350.00, '2024-02-15', 'Pending'),
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Over-Cap Amount - Specialist Consultation', 125.50, '2024-02-20', 'Overdue');

-- Insert test conversation
INSERT INTO conversations (user_id, title, last_message, unread_count) VALUES
  ((SELECT id FROM users WHERE email = 'david@example.com'), 'Claim Inquiry', 'When will my claim be processed?', 1);

-- Insert test messages
INSERT INTO messages (conversation_id, text, sender, timestamp, is_read) VALUES
  ((SELECT id FROM conversations WHERE title = 'Claim Inquiry'), 'Hello, I submitted a claim last week and wanted to check on its status.', 'user', NOW() - INTERVAL '2 days', true),
  ((SELECT id FROM conversations WHERE title = 'Claim Inquiry'), 'Thank you for contacting us. Let me check that for you.', 'support', NOW() - INTERVAL '1 day', true),
  ((SELECT id FROM conversations WHERE title = 'Claim Inquiry'), 'When will my claim be processed?', 'user', NOW() - INTERVAL '4 hours', false);
