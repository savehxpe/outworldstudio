-- Outworld Studio Database Schema

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  original_filename TEXT,
  original_file_url TEXT,
  original_duration REAL,
  original_size BIGINT,
  format TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id);

CREATE TABLE stems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('vocals', 'drums', 'bass', 'other', 'instrumental')),
  audio_url TEXT NOT NULL,
  duration REAL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE stems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read stems of own projects"
  ON stems FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects WHERE projects.id = stems.project_id AND projects.user_id = auth.uid()
    )
  );

CREATE TABLE billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL,
  credits_purchased INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own billing"
  ON billing FOR SELECT
  USING (auth.uid() = user_id);

CREATE TABLE processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('separate_vocal', 'split_stem')),
  stem_type TEXT,
  suno_job_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  credits_consumed INTEGER DEFAULT 0,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own jobs"
  ON processing_jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('audio_uploads', 'audio_uploads', false),
  ('stem_outputs', 'stem_outputs', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'audio_uploads'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can read own uploads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'audio_uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read stem outputs of own projects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'stem_outputs'
    AND auth.role() = 'authenticated'
  );
