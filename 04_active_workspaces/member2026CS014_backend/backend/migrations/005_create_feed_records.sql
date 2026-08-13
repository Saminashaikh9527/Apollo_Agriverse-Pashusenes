CREATE TABLE IF NOT EXISTS feed_records (
    feed_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    recorded_by_user_id INTEGER NOT NULL,
    feed_date DATE NOT NULL,
    feed_type VARCHAR(100) NOT NULL,
    quantity_kg DOUBLE PRECISION NOT NULL CHECK (quantity_kg > 0),
    cost DOUBLE PRECISION CHECK (cost IS NULL OR cost >= 0),
    notes VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feed_records_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals (animal_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_feed_records_recorded_by_user
        FOREIGN KEY (recorded_by_user_id)
        REFERENCES users (user_id)
);

CREATE INDEX IF NOT EXISTS ix_feed_records_animal_id
    ON feed_records (animal_id);

CREATE INDEX IF NOT EXISTS ix_feed_records_recorded_by_user_id
    ON feed_records (recorded_by_user_id);
