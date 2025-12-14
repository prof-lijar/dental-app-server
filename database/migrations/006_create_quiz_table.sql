-- =========================
-- quiz
-- =========================
CREATE TABLE quiz (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- ox_question
-- =========================
CREATE TABLE ox_question (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    explanation TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- multi_choice_question
-- =========================
CREATE TABLE multi_choice_question (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    explanation TEXT,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- choice_option
-- =========================
CREATE TABLE choice_option (
    id BIGSERIAL PRIMARY KEY,
    multi_choice_question_id BIGINT REFERENCES multi_choice_question(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    is_answer BOOLEAN DEFAULT FALSE
);

-- =========================
-- quiz_ox_question_map
-- =========================
CREATE TABLE quiz_ox_question_map (
    quiz_id BIGINT REFERENCES quiz(id) ON DELETE CASCADE,
    ox_question_id BIGINT REFERENCES ox_question(id) ON DELETE CASCADE,

    PRIMARY KEY (quiz_id, ox_question_id)
);

-- =========================
-- quiz_multi_choice_question_map
-- =========================
CREATE TABLE quiz_multi_choice_question_map (
    quiz_id BIGINT REFERENCES quiz(id) ON DELETE CASCADE,
    multi_choice_question_id BIGINT REFERENCES multi_choice_question(id) ON DELETE CASCADE,

    PRIMARY KEY (quiz_id, multi_choice_question_id)
);


