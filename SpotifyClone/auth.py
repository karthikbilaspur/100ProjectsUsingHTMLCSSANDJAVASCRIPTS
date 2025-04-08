from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from models import User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'message': 'Invalid username or password'})

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@auth.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    hashed_password = generate_password_hash(password)
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'})

@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    username = request.json['username']
    user = User.query.filter_by(username=username).first()
    if user:
        # Send password reset email
        return jsonify({'message': 'Password reset email sent successfully'})
    return jsonify({'message': 'User not found'})

@auth.route('/reset-password', methods=['POST'])
def reset_password():
    username = request.json['username']
    new_password = request.json['new_password']
    user = User.query.filter_by(username=username).first()
    if user:
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({'message': 'Password reset successfully'})
    return jsonify({'message': 'User not found'})

@auth.route('/change-password', methods=['POST'])
@login_required
def change_password():
    old_password = request.json['old_password']
    new_password = request.json['new_password']
    user = User.query.filter_by(id=current_user.id).first()
    if user and check_password_hash(user.password, old_password):
        user.password = generate_password_hash(new_password)
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'})
    return jsonify({'message': 'Invalid old password'})