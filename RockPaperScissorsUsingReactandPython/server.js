const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const db = require('./db');
const jwt = require('jsonwebtoken');
const cache = require('memory-cache');

app.use(express.json());

app.post('/login', async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
        if (user.rows.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        res.send({ message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/logout', async (req, res) => {
    try {
        res.send({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/game', async (req, res) => {
    try {
        const game = await db.query('INSERT INTO games (user_id, game_mode, result) VALUES ($1, $2, $3) RETURNING *', [req.body.userId, req.body.gameMode, req.body.result]);
        res.send(game.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await db.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
        if (user.rows.length === 0) {
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });
        res.send({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/games', async (req, res) => {
    try {
        const games = await db.query('SELECT * FROM games');
        res.send(games.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.post('/game', async (req, res) => {
    try {
        const game = await db.query('INSERT INTO games (user_id, game_mode, variation, result) VALUES ($1, $2, $3, $4) RETURNING *', [req.body.userId, req.body.gameMode, req.body.variation, req.body.result]);
        res.send(game.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

const aiOpponent = async (req, res) => {
    try {
        const userChoice = req.body.choice;
        const aiChoice = getAiChoice();
        const result = determineWinner(userChoice, aiChoice);
        res.send({ result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

const getAiChoice = () => {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
};

const determineWinner = (userChoice, aiChoice) => {
    if (userChoice === aiChoice) {
        return 'It\'s a tie!';
    } else if ((userChoice === 'rock' && aiChoice === 'scissors') || (userChoice === 'paper' && aiChoice === 'rock') || (userChoice === 'scissors' && aiChoice === 'paper')) {
        return 'You win!';
    } else {
        return 'You lose!';
    }
};

app.post('/friends', async (req, res) => {
    try {
        const friend = await db.query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2) RETURNING *', [req.body.userId, req.body.friendId]);
        res.send(friend.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.get('/games', async (req, res) => {
    try {
        const cachedGames = cache.get('games');
        if (cachedGames) {
            res.send(cachedGames);
        } else {
            const games = await db.query('SELECT * FROM games');
            cache.put('games', games.rows);
            res.send(games.rows);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/feedback', async (req, res) => {
    try {
        const feedback = await db.query('INSERT INTO feedback (user_id, feedback) VALUES ($1, $2) RETURNING *', [req.body.userId, req.body.feedback]);
        res.send(feedback.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

server.listen(5000, () => {
    console.log('Server listening on port 5000');
});