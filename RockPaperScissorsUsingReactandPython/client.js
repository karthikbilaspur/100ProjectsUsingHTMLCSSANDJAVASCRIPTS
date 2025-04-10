// client-side
import React, { useState, useEffect } from 'react';
import './Game.css';

function Game() {
    // ...
    return (
        <div className="game-container">
            <h1>Rock Paper Scissors</h1>
            <form onSubmit={handlePlayGame}>
                <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                    <option value="">Select Game Mode</option>
                    <option value="single-player">Single Player</option>
                    <option value="multi-player">Multi Player</option>
                </select>
                <button type="submit">Play Game</button>
            </form>
            <p>Result: {result}</p>
            <h2>Chat Room</h2>
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
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}