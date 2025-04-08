import pygame
import random
import requests
import socket
from client import HangmanClient
from server import HangmanServer
import json
from database import Database


# Constants

WIDTH, HEIGHT = 800, 600
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Pygame initialization
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Hangman Game")
clock = pygame.time.Clock()

# Font and sound effects
font = pygame.font.Font(None, 36)
correct_sound = pygame.mixer.Sound("correct.wav")
incorrect_sound = pygame.mixer.Sound("incorrect.wav")

# Game modes and power-ups
game_modes = ["easy", "medium", "hard"]
power_ups = ["reveal_letter", "skip_turn"]

# Leaderboard and game history
leaderboard = []
game_history = []

# Socket connection
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

class HangmanGame:
    def __init__(self):
        self.word = self.get_random_word()
        self.guessed_letters = ['_'] * len(self.word)
        self.incorrect_guesses = 0
        self.score = 0
        self.game_over = False

    def get_random_word(self):
        response = requests.get("https://random-word-api.herokuapp.com/word?number=1")
        return response.json()[0].lower()

    def draw_hangman(self):
        # Draw hangman figure
        if self.incorrect_guesses >= 1:
            pygame.draw.line(screen, BLACK, (WIDTH // 2 - 100, HEIGHT // 2 + 50), (WIDTH // 2 + 100, HEIGHT // 2 + 50), 5)
        if self.incorrect_guesses >= 2:
            pygame.draw.line(screen, BLACK, (WIDTH // 2, HEIGHT // 2 + 50), (WIDTH // 2, HEIGHT // 2 - 100), 5)
        if self.incorrect_guesses >= 3:
            pygame.draw.line(screen, BLACK, (WIDTH // 2, HEIGHT // 2 - 100), (WIDTH // 2 - 50, HEIGHT // 2 - 150), 5)
        if self.incorrect_guesses >= 4:
            pygame.draw.line(screen, BLACK, (WIDTH // 2, HEIGHT // 2 - 100), (WIDTH // 2 + 50, HEIGHT // 2 - 150), 5)
        if self.incorrect_guesses >= 5:
            pygame.draw.circle(screen, BLACK, (WIDTH // 2, HEIGHT // 2 - 120), 20)
        if self.incorrect_guesses >= 6:
            pygame.draw.line(screen, BLACK, (WIDTH // 2, HEIGHT // 2 - 100), (WIDTH // 2, HEIGHT // 2 - 80), 5)

    def update_leaderboard(self):
        leaderboard.append(self.score)
        leaderboard.sort(reverse=True)
        leaderboard = leaderboard[:10]

    def update_game_history(self):
        game_history.append((self.score, self.word))

    def play_sound_effect(self, correct):
        if correct:
            correct_sound.play()
        else:
            incorrect_sound.play()

def main():
    game = HangmanGame()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.unicode.isalpha():
                    guess = event.unicode.lower()
                    if guess in game.word:
                        for i, letter in enumerate(game.word):
                            if letter == guess:
                                game.guessed_letters[i] = guess
                        game.play_sound_effect(True)
                    else:
                        game.incorrect_guesses += 1
                        game.play_sound_effect(False)

        screen.fill(WHITE)
        text = font.render(' '.join(game.guessed_letters), True, BLACK)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
        text = font.render(f'Incorrect Guesses: {game.incorrect_guesses}', True, RED)
        screen.blit(text, (10, 10))
        game.draw_hangman()

        if '_' not in game.guessed_letters:
            game.update_leaderboard()
            game.update_game_history()
            text = font.render('You win!', True, BLACK)
            screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
            pygame.display.flip()
            pygame.time.wait(2000)
            running = False
                elif game.incorrect_guesses >= 6:
            game.update_leaderboard()
            game.update_game_history()
            text = font.render('You lose!', True, BLACK)
            screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
            pygame.display.flip()
            pygame.time.wait(2000)
            running = False

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

def multiplayer_game():
    sock.connect(("localhost", 12345))
    game = HangmanGame()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.unicode.isalpha():
                    guess = event.unicode.lower()
                    if guess in game.word:
                        for i, letter in enumerate(game.word):
                            if letter == guess:
                                game.guessed_letters[i] = guess
                        game.play_sound_effect(True)
                        sock.sendall(f"Correct guess: {guess}".encode())
                    else:
                        game.incorrect_guesses += 1
                        game.play_sound_effect(False)
                        sock.sendall(f"Incorrect guess: {guess}".encode())

        screen.fill(WHITE)
        text = font.render(' '.join(game.guessed_letters), True, BLACK)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
        text = font.render(f'Incorrect Guesses: {game.incorrect_guesses}', True, RED)
        screen.blit(text, (10, 10))
        game.draw_hangman()

        data = sock.recv(1024)
        if data:
            message = data.decode()
            if message.startswith("Correct guess:"):
                guess = message.split(": ")[1]
                for i, letter in enumerate(game.word):
                    if letter == guess:
                        game.guessed_letters[i] = guess
            elif message.startswith("Incorrect guess:"):
                guess = message.split(": ")[1]
                game.incorrect_guesses += 1

        if '_' not in game.guessed_letters:
            game.update_leaderboard()
            game.update_game_history()
            text = font.render('You win!', True, BLACK)
            screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
            pygame.display.flip()
            pygame.time.wait(2000)
            running = False
        elif game.incorrect_guesses >= 6:
            game.update_leaderboard()
            game.update_game_history()
            text = font.render('You lose!', True, BLACK)
            screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
            pygame.display.flip()
            pygame.time.wait(2000)
            running = False

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

def main_menu():
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if 100 <= event.pos[0] <= 300 and 100 <= event.pos[1] <= 200:
                    main()
                elif 100 <= event.pos[0] <= 300 and 250 <= event.pos[1] <= 350:
                    multiplayer_game()

        screen.fill(WHITE)
        text = font.render('Hangman Game', True, BLACK)
        screen.blit(text, (WIDTH // 2 - text.get_width() // 2, 50))
        pygame.draw.rect(screen, BLACK, (100, 100, 200, 100), 2)
        text = font.render('Single Player', True, BLACK)
        screen.blit(text, (150, 120))
        pygame.draw.rect(screen, BLACK, (100, 250, 200, 100), 2)
        text = font.render('Multiplayer', True, BLACK)
        screen.blit(text, (150, 270))

        pygame.display.flip()
        clock.tick(60)

    pygame.quit()

def multiplayer_game():
    client = HangmanClient()
    client.run()

    # Load the game state from the JSON file
    with open('game_state.json', 'r') as f:
        game_state = json.load(f)

    while True:
        # Get the game state from the server
        server_game_state = client.client.recv(1024).decode('ascii')
        if server_game_state:
            # Update the game state
            server_game_state = json.loads(server_game_state)
            game_state['word'] = server_game_state['word']
            game_state['guessed_letters'] = server_game_state['guessed_letters']
            game_state['incorrect_guesses'] = server_game_state['incorrect_guesses']

            # Save the game state to the JSON file
            with open('game_state.json', 'w') as f:
                json.dump(game_state, f)

            # Draw the game board
            screen.fill(WHITE)
            text = font.render(' '.join(game_state['guessed_letters']), True, BLACK)
            screen.blit(text, (WIDTH // 2 - text.get_width() // 2, HEIGHT // 2 - text.get_height() // 2))
            text = font.render(f'Incorrect Guesses: {game_state["incorrect_guesses"]}', True, RED)
            screen.blit(text, (10, 10))

            # Handle player input
            for event in pygame.event.get():
                if event.type == pygame.KEYDOWN:
                    if event.unicode.isalpha():
                        move = event.unicode.lower()
                        # Send the player's move to the server
                        client.client.send(json.dumps({'move': move}).encode('ascii'))

        # Update the display
        pygame.display.flip()
        clock.tick(60)
        
db = Database()

# Create a new game session
db.create_game_session("user123", "easy")

# Get a game session
game_session = db.get_game_session("game_session_id")

# Update a game session
db.update_game_session("game_session_id", {"word": "new_word"})

# Create a new user account
db.create_user_account("username", "password")

# Get a user account
user_account = db.get_user_account("user_id")

# Update a user account
db.update_user_account("user_id", {"score": 100})

# Update the leaderboard
db.update_leaderboard("user_id", 100)

if __name__ == "__main__":
    main_menu()