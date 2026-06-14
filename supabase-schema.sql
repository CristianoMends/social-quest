-- Execute esse SQL no Supabase: Dashboard → SQL Editor → New Query

-- Emails autorizados (preenchido pelo webhook da Kiwify)
CREATE TABLE purchases (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email           TEXT        UNIQUE NOT NULL,
  kiwify_order_id TEXT,
  purchased_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Tokens de magic link (one-time use, expiram em 15 min)
CREATE TABLE magic_tokens (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  token       TEXT        UNIQUE NOT NULL,
  email       TEXT        NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para busca rápida por token
CREATE INDEX idx_magic_tokens_token ON magic_tokens (token);

-- Progresso de cada usuário
CREATE TABLE progress (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT        UNIQUE NOT NULL,
  done       JSONB       DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,                        -- data da 1ª missão concluída
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migration (se a tabela já existe):
-- ALTER TABLE progress ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

-- Rate limit de tentativas de login por IP
CREATE TABLE login_attempts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  ip           TEXT        NOT NULL,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_attempts_ip_time ON login_attempts (ip, attempted_at);

-- Limpeza de registros antigos (rode periodicamente ou agende no Supabase)
-- DELETE FROM magic_tokens   WHERE expires_at   < NOW();
-- DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day';
