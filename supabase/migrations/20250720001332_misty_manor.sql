/*
  # Fix login_table RLS policies

  1. Security Changes
    - Disable RLS on login_table to allow public access for authentication
    - Add policy to allow public read access for login verification
*/

-- First, ensure the table exists and has the right structure
CREATE TABLE IF NOT EXISTS login_table (
  id bigint PRIMARY KEY,
  user_name character varying NOT NULL,
  password character varying NOT NULL
);

-- Disable RLS temporarily for authentication to work
ALTER TABLE login_table DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, add a public read policy
-- ALTER TABLE login_table ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public read for authentication"
--   ON login_table
--   FOR SELECT
--   TO public
--   USING (true);

-- Insert sample data if it doesn't exist
INSERT INTO login_table (id, user_name, password) VALUES
  (1, 'admin@example.com', 'admin123'),
  (2, 'user@example.com', 'user123'),
  (3, 'john@example.com', 'password123'),
  (4, 'jane@example.com', 'securepass')
ON CONFLICT (id) DO NOTHING;