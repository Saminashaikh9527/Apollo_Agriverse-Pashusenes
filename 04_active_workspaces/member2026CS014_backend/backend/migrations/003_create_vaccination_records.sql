CREATE TABLE IF NOT EXISTS vaccination_records (
    vaccination_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    administered_by_user_id INTEGER NOT NULL,
    vaccine_name VARCHAR(255) NOT NULL,
    vaccination_date DATE NOT NULL,
    next_due_date DATE,
    dose VARCHAR(100),
    veterinarian VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vaccination_records_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals (animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_vaccination_records_administered_by_user
        FOREIGN KEY (administered_by_user_id)
        REFERENCES users (user_id),
    CONSTRAINT ck_vaccination_records_due_date
        CHECK (next_due_date IS NULL OR next_due_date >= vaccination_date)
);

CREATE INDEX IF NOT EXISTS ix_vaccination_records_animal_id
    ON vaccination_records (animal_id);

CREATE INDEX IF NOT EXISTS ix_vaccination_records_administered_by_user_id
    ON vaccination_records (administered_by_user_id);
