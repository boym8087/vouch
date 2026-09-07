CREATE TABLE IF NOT EXISTS responses (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_slug      TEXT NOT NULL,
  respondent_name   TEXT NOT NULL,
  respondent_email  TEXT NOT NULL,
  respondent_phone  TEXT,
  answers           TEXT NOT NULL,  -- JSON, so new questions need no migration
  created_at        TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_responses_subject ON responses (subject_slug);
