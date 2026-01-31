select
  *
from
  articles
where
  title = 'test'
order by
  current_date desc;

delete from
  articles
where
  title = 'test';
commit;

INSERT INTO
  storage.buckets (id, name, public)
VALUES
  ('dms-global-files', 'dms-global-files', true)
ON CONFLICT (id)
DO
  UPDATE
  SET public = true;

  select
    *
  from
    storage.buckets;

  -- Create the storage bucket if it doesn't exist
  INSERT INTO
    storage.buckets (id, name, public)
  VALUES
    ('dms-global-files', 'dms-global-files', true)
  ON CONFLICT (id)
DO
  UPDATE
  SET public = true;

  -- Policy to allow anyone to read files (public access)
  CREATE POLICY "Public Access"
  ON storage.objects
  FOR
  SELECT
  TO
    public
  USING (bucket_id = 'dms-global-files');

  -- Policy to allow authenticated users to upload files
  CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO
    public
  WITH CHECK (bucket_id = 'dms-global-files');

  -- Policy to allow authenticated users to update files
  CREATE POLICY "Authenticated users can update files"
  ON storage.objects
  FOR UPDATE
  TO
    public
  USING (bucket_id = 'dms-global-files')
  WITH CHECK (bucket_id = 'dms-global-files');

  -- Policy to allow authenticated users to delete files
  CREATE POLICY "Authenticated users can delete files"
  ON storage.objects
  FOR DELETE
  TO
    public
  USING (bucket_id = 'dms-global-files');