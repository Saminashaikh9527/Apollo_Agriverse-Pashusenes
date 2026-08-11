CREATE TABLE IF NOT EXISTS animal_health_records (
    health_record_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    recorded_by_user_id INTEGER NOT NULL,
    record_date DATE NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    symptoms TEXT,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_animal_health_records_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals (animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_animal_health_records_recorded_by_user
        FOREIGN KEY (recorded_by_user_id)
        REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_animal_health_records_animal_id
    ON animal_health_records (animal_id);

CREATE INDEX IF NOT EXISTS ix_animal_health_records_recorded_by_user_id
    ON animal_health_records (recorded_by_user_id);
