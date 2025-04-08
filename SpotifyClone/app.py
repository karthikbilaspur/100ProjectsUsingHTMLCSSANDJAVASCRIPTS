from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required
from flask_cors import CORS
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import NMF
from surprise import KNNBasic
import numpy as np
import pandas as pd
import logging
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
CORS(app)

# Logging configuration
logging.basicConfig(filename='app.log', level=logging.INFO)

# Database models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))

class Music(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    artist = db.Column(db.String(100))

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    music_id = db.Column(db.Integer, db.ForeignKey('music.id'))
    rating = db.Column(db.Integer)

# Recommendation algorithms
def recommend(user_id):
    # Get user ratings
    ratings = Rating.query.filter_by(user_id=user_id).all()
    # Get music features
    music_features = []
    for rating in ratings:
        music = Music.query.get(rating.music_id)
        features = [music.title, music.artist]
        music_features.append(features)
    # Train nearest neighbors model
    nn = NearestNeighbors(n_neighbors=5)
    nn.fit(music_features)
    # Get recommendations
    recommendations = []
    for music in Music.query.all():
        features = [music.title, music.artist]
        distances, indices = nn.kneighbors([features])
        for i in indices[0]:
            recommendations.append(Music.query.get(i))
    return recommendations

def recommend_nmf(user_id):
    # Get user ratings
    ratings = Rating.query.filter_by(user_id=user_id).all()
    # Get music features
    music_features = []
    for rating in ratings:
        music = Music.query.get(rating.music_id)
        features = [music.title, music.artist]
        music_features.append(features)
    # Train NMF model
    nmf = NMF(n_components=5)
    nmf.fit(music_features)
    # Get recommendations
    recommendations = []
    for music in Music.query.all():
        features = [music.title, music.artist]
        transformed_features = nmf.transform(features)
        distances, indices = nn.kneighbors(transformed_features)
        for i in indices[0]:
            recommendations.append(Music.query.get(i))
    return recommendations

def recommend_knn(user_id):
    # Get user ratings
    ratings = Rating.query.filter_by(user_id=user_id).all()
    # Get music features
    music_features = []
    for rating in ratings:
        music = Music.query.get(rating.music_id)
        features = [music.title, music.artist]
        music_features.append(features)
    # Train KNN model
    sim_options = {'name': 'pearson_baseline', 'user_based': False}
    sim = KNNBasic(sim_options=sim_options)
    sim.fit(music_features)
    # Get recommendations
    recommendations = []
    for music in Music.query.all():
        features = [music.title, music.artist]
        inner_id = sim.trainset.to_inner_uid(features)
        recommendations.append(Music.query.get(inner_id))
    return recommendations

# Routes
@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('user_id')
    recommendations = recommend(user_id)
    return jsonify({'recommendations': recommendations})

@app.route('/api/recommend_nmf', methods=['GET'])
def get_recommendations_nmf():
    user_id = request.args.get('user_id')
    recommendations = recommend_nmf(user_id)
    return jsonify({'recommendations': recommendations})

@app.route('/api/recommend_knn', methods=['GET'])
def get_recommendations_knn():
    user_id = request.args.get('user_id')
    recommendations = recommend_knn(user_id)
    return jsonify({'recommendations': recommendations})

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        login_user(user)
        return jsonify({'message': 'Logged in successfully'})
    return jsonify({'message': 'Invalid username or password'})

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    user = User(username=username, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registered successfully'})

@app.route('/api/ratings', methods=['POST'])
def add_rating():
    user_id = request.json['user_id']
    music_id = request.json['music_id']
    rating = request.json['rating']
    rating_obj = Rating(user_id=user_id, music_id=music_id, rating=rating)
    db.session.add(rating_obj)
    db.session.commit()
    return jsonify({'message': 'Rating added successfully'})

@app.route('/api/ratings', methods=['GET'])
def get_ratings():
    user_id = request.args.get('user_id')
    ratings = Rating.query.filter_by(user_id=user_id).all()
    return jsonify({'ratings': [rating.rating for rating in ratings]})

@app.route('/api/music', methods=['GET'])
def get_music():
    music = Music.query.all()
    return jsonify({'music': [music.title for music in music]})

@app.route('/api/music', methods=['POST'])
def add_music():
    title = request.json['title']
    artist = request.json['artist']
    music = Music(title=title, artist=artist)
    db.session.add(music)
    db.session.commit()
    return jsonify({'message': 'Music added successfully'})

if __name__ == '__main__':
    app.run(debug=True)