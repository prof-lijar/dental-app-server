CREATE TYPE report_type AS ENUM (
    'TODO',
    'RECOMMEND',
    'TASK'
);


CREATE TABLE health_check_result (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    result TEXT NOT NULL,
    my_status VARCHAR(200),
    health_score INT,

    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_health_check_result_user_id ON health_check_result(user_id);


CREATE TABLE health_check_report (
    id BIGSERIAL PRIMARY KEY,
    check_result_id BIGINT NOT NULL
        REFERENCES health_check_result(id) ON DELETE CASCADE,

    report VARCHAR(100) NOT NULL,
    report_type report_type NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_health_check_report_check_result_id
ON health_check_report(check_result_id);
