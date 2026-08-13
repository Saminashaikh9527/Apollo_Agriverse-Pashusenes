CREATE TABLE IF NOT EXISTS egg_production (
    egg_id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL,
    production_date DATE NOT NULL,
    egg_count INTEGER NOT NULL DEFAULT 0,
    broken_eggs INTEGER NOT NULL DEFAULT 0,
    average_weight_grams DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_egg_animal
        FOREIGN KEY (animal_id)
        REFERENCES animals(animal_id)
        ON DELETE CASCADE,

    CONSTRAINT check_egg_count
        CHECK (egg_count >= 0),

    CONSTRAINT check_broken_eggs
        CHECK (broken_eggs >= 0),

    CONSTRAINT check_broken_less_than_total
        CHECK (broken_eggs <= egg_count)
);

CREATE INDEX IF NOT EXISTS ix_egg_production_animal_id
    ON egg_production(animal_id);