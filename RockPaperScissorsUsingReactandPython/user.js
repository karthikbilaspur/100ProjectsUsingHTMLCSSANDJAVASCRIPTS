const db = require('./db');

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static async create(username, password) {
        const query = {
            text: 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            values: [username, password],
        };

        const result = await db.query(query);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = {
            text: 'SELECT * FROM users WHERE username = $1',
            values: [username],
        };

        const result = await db.query(query);
        return result.rows[0];
    }

    static async findById(id) {
        const query = {
            text: 'SELECT * FROM users WHERE id = $1',
            values: [id],
        };

        const result = await db.query(query);
        return result.rows[0];
    }
}

module.exports = User;