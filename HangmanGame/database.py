import pymongo

# Connect to the MongoDB database
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["hangman_game"]

# Create a collection for game sessions
game_sessions = db["game_sessions"]

# Create a collection for user accounts
users = db["users"]

# Create a collection for leaderboards
leaderboards = db["leaderboards"]

class Database:
    def create_game_session(self, user_id, game_mode):
        game_session = {
            "user_id": user_id,
            "game_mode": game_mode,
            "word": "",
            "guessed_letters": [],
            "incorrect_guesses": 0,
            "score": 0
        }
        game_sessions.insert_one(game_session)

    def update_game_session(self, game_session_id, data):
        game_sessions.update_one({"_id": game_session_id}, {"$set": data})

    def get_game_session(self, game_session_id):
        return game_sessions.find_one({"_id": game_session_id})

    def create_user_account(self, username, password):
        user = {
            "username": username,
            "password": password,
            "score": 0
        }
        users.insert_one(user)

    def update_user_account(self, user_id, data):
        users.update_one({"_id": user_id}, {"$set": data})

    def get_user_account(self, user_id):
        return users.find_one({"_id": user_id})

    def update_leaderboard(self, user_id, score):
        leaderboards.update_one({"user_id": user_id}, {"$set": {"score": score}}, upsert=True)