-- =========================
-- parent_child_map
-- =========================
CREATE TABLE IF NOT EXISTS parent_child_map (
    id BIGSERIAL PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parent_child_map_parent_id
ON parent_child_map(parent_id);

CREATE INDEX idx_parent_child_map_child_id
ON parent_child_map(child_id);

ALTER TABLE users
ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'PARENT';