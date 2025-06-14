/*
  # Allow anonymous users to insert articles

  This migration updates the RLS policy to allow anonymous users to insert articles.
  This is useful for development or if you want to allow public article submissions.
  
  ## Changes
  1. Drop the existing restrictive insert policy
  2. Create a new policy that allows both authenticated and anonymous users to insert articles
  
  ## Security Note
  In production, you may want to implement proper authentication instead of allowing anonymous inserts.
*/

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Authenticated users can insert articles" ON articles;

-- Create a new policy that allows both authenticated and anonymous users to insert articles
CREATE POLICY "Allow public article inserts"
  ON articles
  FOR INSERT
  TO public
  WITH CHECK (true);