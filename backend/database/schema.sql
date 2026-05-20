-- ============================================================================
-- AWS Simulator Database Schema
-- ============================================================================

-- Tabela de usuários (anônimos)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anonymous_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de questões
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification VARCHAR(20) NOT NULL,
    domain VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer JSONB NOT NULL,
    explanation TEXT NOT NULL,
    reference_url TEXT,
    validated_by VARCHAR(100),
    validated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para questões
CREATE INDEX IF NOT EXISTS idx_questions_certification ON questions(certification);
CREATE INDEX IF NOT EXISTS idx_questions_domain ON questions(domain);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_validated ON questions(validated_by);

-- Tabela de histórico de quizzes
CREATE TABLE IF NOT EXISTS quiz_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    certification VARCHAR(20) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    domain_scores JSONB NOT NULL,
    weak_domains TEXT[],
    completed_at TIMESTAMP DEFAULT NOW()
);

-- Índices para histórico
CREATE INDEX IF NOT EXISTS idx_quiz_history_user ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_certification ON quiz_history(certification);
CREATE INDEX IF NOT EXISTS idx_quiz_history_completed ON quiz_history(completed_at);

-- Tabela de respostas individuais
CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quiz_history(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    user_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP DEFAULT NOW()
);

-- Índices para respostas
CREATE INDEX IF NOT EXISTS idx_answers_quiz ON answers(quiz_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_correct ON answers(is_correct);

-- Tabela de gamificação
CREATE TABLE IF NOT EXISTS gamification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_quizzes INTEGER DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    last_date DATE,
    badges TEXT[],
    completed_stages TEXT[],
    unlocked_stages TEXT[],
    labs_completed INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para gamificação
CREATE INDEX IF NOT EXISTS idx_gamification_user ON gamification(user_id);

-- Tabela de focus sessions (Pomodoro)
CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    minutes INTEGER NOT NULL,
    session_type VARCHAR(20) NOT NULL,
    session_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para focus sessions
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_date ON focus_sessions(session_date);

-- ============================================================================
-- Comentários das tabelas
-- ============================================================================

COMMENT ON TABLE users IS 'Usuários anônimos do simulador';
COMMENT ON TABLE questions IS 'Banco de questões de certificação AWS';
COMMENT ON TABLE quiz_history IS 'Histórico de quizzes realizados';
COMMENT ON TABLE answers IS 'Respostas individuais de cada questão';
COMMENT ON TABLE gamification IS 'Dados de gamificação do usuário';
COMMENT ON TABLE focus_sessions IS 'Histórico de sessões de foco (Pomodoro)';
