from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@localhost/db_name'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
socketio = SocketIO(app)

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    game_mode = db.Column(db.String(80), nullable=False)
    result = db.Column(db.String(80), nullable=False)

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        leaderboard = db.session.execute('SELECT * FROM user ORDER BY wins DESC').fetchall()
        return jsonify([dict(row) for row in leaderboard])
    except Exception as error:
        print(error)
        return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/statistics', methods=['GET'])
@login_required
def statistics():
    try:
        user_id = request.args.get('user_id')
        statistics = db.session.execute('SELECT * FROM games WHERE user_id = :user_id', {'user_id': user_id}).fetchall()
        return jsonify([dict(row) for row in statistics])
    except Exception as error:
        print(error)
        return jsonify({'message': 'Internal Server Error'}), 500


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/game', methods=['POST'])
@login_required
def create_game():
    try:
        user_id = request.json['user_id']
        opponent_id = request.json.get('opponent_id')  # Optional
        game_mode = request.json['game_mode']
        result = request.json['result']
        game = Game(user_id=user_id, game_mode=game_mode, result=result)
        db.session.add(game)
        db.session.commit()
        return jsonify({'message': 'Game created successfully', 'game': {'id': game.id, 'user_id': game.user_id, 'game_mode': game.game_mode, 'result': game.result}})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/game', methods=['POST'])
@login_required
def play_game():
    game_mode = request.json['game_mode']
    user_id = current_user.id
    # Game logic here
    result = 'win'  # Replace with actual result
    game = Game(user_id=user_id, game_mode=game_mode, result=result)
    db.session.add(game)
    db.session.commit()
    return jsonify({'message': 'Game played successfully'})

@socketio.on('connect')
def connect():
    emit('connected', {'message': 'Connected to server'})

@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')

@socketio.on('message')
def handle_message(message):
    user_id = current_user.id
    message = Message(user_id=user_id, message=message)
    db.session.add(message)
    db.session.commit()
    emit('message', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)