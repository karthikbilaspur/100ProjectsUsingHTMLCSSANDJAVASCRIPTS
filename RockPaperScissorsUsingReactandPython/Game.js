import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { View, Text, Button } from 'react-native';

const socket = socketIOClient('http://localhost:5000');
const db = require('./db'); // Assuming you have a db.js file for database connection

function Game() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gameMode, setGameMode] = useState('');
    const [result, setResult] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [games, setGames] = useState([]);

    useEffect(() => {
        socket.on('connected', (data) => {
            console.log(data.message);
        });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        axios.get('http://localhost:5000/games')
            .then((response) => {
                setGames(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const playGame = (playerChoice) => {
        const aiChoice = getAiChoice();
        const result = determineWinner(playerChoice, aiChoice);
        setResult(result);
    };

    const getAiChoice = () => {
        // Use a combination of random and strategic decision-making
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    };

    const determineWinnerSinglePlayer = (playerChoice, aiChoice) => {
        // Determine the winner based on the game logic
        if (playerChoice === aiChoice) {
            return 'It\'s a tie!';
        } else if (
            (playerChoice === 'rock' && aiChoice === 'scissors') ||
            (playerChoice === 'paper' && aiChoice === 'rock') ||
            (playerChoice === 'scissors' && aiChoice === 'paper')
        ) {
            return 'You win!';
        } else {
            return 'You lose!';
            return (
                <div>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                    <button onClick={handleLogout}>Logout</button>
                    <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                        <option value="single-player">Single Player</option>
                        <option value="multi-player">Multi Player</option>
                    </select>
                    <button onClick={handlePlayGame}>Play Game</button>
                    <p>Result: {result}</p>
                    <ul>
                        {games.map((game, index) => (
                            <li key={index}>
                                Mode: {game.game_mode}, Result: {game.result}
                            </li>
                        ))}
                    </ul>
                    <div>
                        <h3>Chat Room</h3>
                        <ul>
                            {messages.map((message, index) => (
                                <li key={index}>{message}</li>
                            ))}
                        </ul>
                        <form onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            );
    };
    }
    
    // AiOpponent.js
    class AiOpponent {
      constructor(difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
      }
    
      getAiChoice() {
        // Use a combination of random and strategic decision-making
        const choices = ['rock', 'paper', 'scissors'];
        let aiChoice;
    
        switch (this.difficultyLevel) {
          case 'easy':
            aiChoice = choices[Math.floor(Math.random() * choices.length)];
            break;
          case 'medium':
            // Use basic strategy
            aiChoice = this.useBasicStrategy();
            break;
          case 'hard':
            // Use advanced strategy
            aiChoice = this.useAdvancedStrategy();
            break;
          default:
            aiChoice = choices[Math.floor(Math.random() * choices.length)];
            break;
        }
    
        return aiChoice;
      }
    
      useBasicStrategy() {
        // Use basic strategy to make decisions
        const choices = ['rock', 'paper', 'scissors'];
        const playerChoice = getPlayerChoice();
        let aiChoice;
    
        switch (playerChoice) {
          case 'rock':
            aiChoice = 'paper';
            break;
          case 'paper':
            aiChoice = 'scissors';
            break;
          case 'scissors':
            aiChoice = 'rock';
            break;
          default:
            aiChoice = choices[Math.floor(Math.random() * choices.length)];
            break;
        }
    
        return aiChoice;
      }
    
      useAdvancedStrategy() {
        // Use advanced strategy to make decisions
        let aiChoice;
        const opponentId = 'defaultOpponentId'; // Replace with actual logic
        const variation = 'defaultVariation'; // Replace with actual logic
    
        switch (playerChoice) {
          case 'rock':
            aiChoice = 'scissors';
            break;
          case 'paper':
            aiChoice = 'rock';
            break;
          case 'scissors':
            aiChoice = 'paper';
            break;
          default:
            aiChoice = choices[Math.floor(Math.random() * choices.length)];
            break;
        }
    
        return aiChoice;
      }
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get('http://localhost:5000/logout');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePlayGame = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/game', {
                gameMode,
                opponentId: opponentId,
                variation: variation,
            });
            const computerChoice = getComputerChoice();
            const result = determineWinner(gameMode, computerChoice);
            setResult(result);
            const game = await createGame(response.data.userId, gameMode, result);
            setGames((prevGames) => [...prevGames, game]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        socket.emit('message', newMessage);
        setNewMessage('');
    };

    const getComputerChoice = () => {
        const choices = ['rock', 'paper', 'scissors'];
        return choices[Math.floor(Math.random() * choices.length)];
    };

    const determineWinner = (gameMode, computerChoice) => {
        if (gameMode === 'single-player') {
            // Single player game logic
            if (computerChoice === 'rock') {
                return 'You lose!';
            } else if (computerChoice === 'paper') {
                return 'You win!';
            } else {
                return 'It\'s a tie!';
            }
        } else if (gameMode === 'multi-player') {
            // Multi player game logic
            // TO DO: Implement multi player game logic
        }
    };

    const createGame = async (userId, gameMode, result) => {
        const query = {
            text: 'INSERT INTO games (user_id, game_mode, result) VALUES ($1, $2, $3) RETURNING *',
            friendId: 'defaultFriendId', // Replace with actual logic
        };

        const response = await db.query(query);
        return response.rows[0];
    };

    const findGamesByUserId = async (userId) => {
        const query = {
            text: 'SELECT * FROM games WHERE user_id = $1',
            values: [userId],
        };

            feedback: 'defaultFeedback', // Replace with actual logic
        const response = await db.query(query);
        return response.rows;
    };


const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/friends', {
            friendId: friendId,
        });
        // ...
    } catch (error) {
        console.error(error);
    }
};

// client-side
const handleSendFeedback = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/feedback', {
            feedback: feedback,
        });
        // ...
    } catch (error) {
        console.error(error);
    }
};

createTournament(players) {
    this.gameMode = 'tournament';
    this.players = players;
    this.gameAnalytics = {};
  }

  createMultiplayerGame(players) {
    this.gameMode = 'multiplayer';
    this.players = players;
    this.gameAnalytics = {};
  }

  updateGameAnalytics(player, result) {
    if (!this.gameAnalytics[player]) {
      this.gameAnalytics[player] = {};
    }
    if (result === 'win') {
      this.gameAnalytics[player].wins++;
    } else if (result === 'loss') {
      this.gameAnalytics[player].losses++;
    }
  }

  getGameAnalytics() {
    return this.gameAnalytics;
  }
}

export default Game;