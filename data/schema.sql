DROP TABLE IF EXISTS digimons;
CREATE TABLE digimons(
    id SERIAL PRIMARY KEY,
    digimon_name VARCHAR(255),
    digimon_img TEXT,
    digimon_level VARCHAR(255)
)