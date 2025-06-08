/*
  # Create articles table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `content` (text, not null)
      - `excerpt` (text, not null)
      - `author` (text, not null)
      - `categories` (text array, not null)
      - `tags` (text array, not null)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())
      - `reading_time` (integer, not null)
      - `featured` (boolean, default false)

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access
    - Add policy for authenticated users to insert/update/delete
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  author text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reading_time integer NOT NULL DEFAULT 1,
  featured boolean DEFAULT false
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to articles
CREATE POLICY "Articles are publicly readable"
  ON articles
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert articles
CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update articles
CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete articles
CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS articles_categories_idx ON articles USING GIN(categories);
CREATE INDEX IF NOT EXISTS articles_tags_idx ON articles USING GIN(tags);