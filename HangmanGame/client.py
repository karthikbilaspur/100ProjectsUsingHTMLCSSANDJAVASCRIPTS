# Client-side code
import socket
import threading

class HangmanClient:
    def __init__(self):
        self.host = '127.0.0.1'
        self.port = 12345
        self.client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.client.connect((self.host, self.port))

    def receive(self):
        while True:
            try:
                message = self.client.recv(1024).decode('ascii')
                if message == 'NICK':
                    self.client.send(input("Choose a nickname: ").encode('ascii'))
                else:
                    print(message)
            except:
                print("An error occurred!")
                self.client.close()
                break

    def write(self):
        while True:
            message = input('')
            self.client.send(message.encode('ascii'))

    def run(self):
        receive_thread = threading.Thread(target=self.receive)
        receive_thread.start()
        write_thread = threading.Thread(target=self.write)
        write_thread.start()

if __name__ == "__main__":
    HangmanClient().run()