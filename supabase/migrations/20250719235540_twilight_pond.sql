/*
  # Add sample users to login_table

  1. Data Insertion
    - Add test users to `login_table`
    - Includes admin and regular user accounts
    - Uses simple passwords for testing (not recommended for production)

  2. Security Note
    - These are test credentials only
    - In production, passwords should be hashed
    - Consider implementing proper authentication
*/

-- Insert sample users into login_table
INSERT INTO login_table (id, user_name, password) VALUES
  (1, 'admin@example.com', 'admin123'),
  (2, 'user@example.com', 'user123'),
  (3, 'john@example.com', 'password123'),
  (4, 'jane@example.com', 'securepass')
ON CONFLICT (id) DO NOTHING;