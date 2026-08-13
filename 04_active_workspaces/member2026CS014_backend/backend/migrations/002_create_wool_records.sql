CREATE TABLE IF NOT EXISTS wool_records (
    wool_record_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    recorded_by_user_id INTEGER NOT NULL,
    shearing_date DATE NOT NULL,
    wool_weight NUMERIC(8, 2) NOT NULL CHECK (wool_weight > 0),
    wool_quality VARCHAR(100) NOT NULL,
    wool_color VARCHAR(100),
    estimated_price NUMERIC(10, 2) CHECK (estimated_price >= 0),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wool_records_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals (animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_wool_records_recorded_by_user
        FOREIGN KEY (recorded_by_user_id)
        REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_wool_records_animal_id
    ON wool_records (animal_id);

CREATE INDEX IF NOT EXISTS ix_wool_records_recorded_by_user_id
    ON wool_records (recorded_by_user_id);
