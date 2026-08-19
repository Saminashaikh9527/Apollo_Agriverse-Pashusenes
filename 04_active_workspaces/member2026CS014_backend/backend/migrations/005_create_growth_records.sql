CREATE TABLE IF NOT EXISTS growth_records (
    growth_id SERIAL PRIMARY KEY,

    animal_id INTEGER NOT NULL,

    recorded_by_user_id INTEGER NOT NULL,

    measurement_date DATE NOT NULL,

    weight_kg DOUBLE PRECISION NOT NULL,

    height_cm DOUBLE PRECISION,

    body_condition_score DOUBLE PRECISION,

    notes VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_growth_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(animal_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_growth_user
        FOREIGN KEY (recorded_by_user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT chk_growth_weight
        CHECK (weight_kg > 0),

    CONSTRAINT chk_growth_height
        CHECK (height_cm IS NULL OR height_cm > 0),

    CONSTRAINT chk_growth_bcs
        CHECK (
            body_condition_score IS NULL
            OR body_condition_score >= 0
        )
);

CREATE INDEX IF NOT EXISTS idx_growth_animal
    ON growth_records(animal_id);

CREATE INDEX IF NOT EXISTS idx_growth_date
    ON growth_records(measurement_date);