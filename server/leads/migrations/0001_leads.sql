-- Leads captured by the wayneomni.com contact form.
CREATE TABLE IF NOT EXISTS leads (
  id            TEXT PRIMARY KEY,
  created_at    TEXT NOT NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  website       TEXT,
  brief         TEXT NOT NULL,
  consent       INTEGER NOT NULL DEFAULT 0,
  source_page   TEXT,
  country       TEXT,
  ip_hash       TEXT,
  user_agent    TEXT,
  ai_summary    TEXT,
  ai_priority   TEXT,
  ai_draft      TEXT,
  notify_status TEXT,
  copy_status   TEXT,
  status        TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_ip ON leads (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email, created_at);
