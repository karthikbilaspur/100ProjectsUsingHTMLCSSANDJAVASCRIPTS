CREATE TABLE music (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    artist VARCHAR(100) NOT NULL,
    popularity INT NOT NULL
);

CREATE TABLE playlists (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE playlist_music (
    playlist_id INT,
    music_id INT,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (music_id) REFERENCES music(id)
);

CREATE TABLE recommendations (
    id INT PRIMARY KEY,
    user_id INT,
    music_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (music_id) REFERENCES music(id)
);

CREATE TABLE user_playlists (
    user_id INT,
    playlist_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(id)
);

CREATE TABLE ratings (
    id INT PRIMARY KEY,
    user_id INT,
    music_id INT,
    rating INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (music_id) REFERENCES music(id)
);

CREATE INDEX idx_ratings_user_id ON ratings (user_id);
CREATE INDEX idx_ratings_music_id ON ratings (music_id);

CREATE INDEX idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX idx_recommendations_music_id ON recommendations (music_id);

CREATE INDEX idx_playlist_music_playlist_id ON playlist_music (playlist_id);
CREATE INDEX idx_playlist_music_music_id ON playlist_music (music_id);