CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL,
    password VARCHAR(120) NOT NULL
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    game_mode VARCHAR(80) NOT NULL,
    result VARCHAR(80) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);