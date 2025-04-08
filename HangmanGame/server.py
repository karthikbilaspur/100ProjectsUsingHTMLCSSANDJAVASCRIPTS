# Server-side code
import socket
import threading
import json

class HangmanServer:
    def __init__(self):
        self.host = '127.0.0.1'
        self.port = 12345
        self.server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server.bind((self.host, self.port))
        self.server.listen()
        self.clients = []
        self.nicknames = []

    def broadcast(self, message):
        for client in self.clients:
            client.send(message)

    def handle(self, client):
        while True:
            try:
                message = client.recv(1024)
                self.broadcast(message)
            except:
                index = self.clients.index(client)
                self.clients.remove(client)
                client.close()
                nickname = self.nicknames[index]
                self.nicknames.remove(nickname)
                self.broadcast(f'{nickname} left the game!'.encode('ascii'))
                break

    def receive(self):
        while True:
            client, address = self.server.accept()
            print(f"Connected with {str(address)}")

            client.send('NICK'.encode('ascii'))
            nickname = client.recv(1024).decode('ascii')
            self.nicknames.append(nickname)
            self.clients.append(client)

            print(f'Nickname of the client is {nickname}!')
            self.broadcast(f'{nickname} joined the game!'.encode('ascii'))
            client.send('Connected to the server!'.encode('ascii'))

            thread = threading.Thread(target=self.handle, args=(client,))
            thread.start()

    def run(self):
        print("Server Started!")
        self.receive()

def handle_player_move(self, client, move):
    # Update the game state
    game_state = self.game_states[client]
    game_state['guessed_letters'].append(move)
    if move not in game_state['word']:
        game_state['incorrect_guesses'] += 1

    # Send the updated game state to the client
    client.send(json.dumps(game_state).encode('ascii'))

if __name__ == "__main__":
    HangmanServer().run()