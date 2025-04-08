from flask import Blueprint, request, jsonify
from models import Music, User, Rating
from app import db
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import NMF
import numpy as np

recommendation = Blueprint('recommendation', __name__)

@recommendation.route('/recommend', methods=['GET'])
def get_recommendations():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if user:
        ratings = Rating.query.filter_by(user_id=user_id).all()
        music_ids = [rating.music_id for rating in ratings]
        music_features = []
        for music_id in music_ids:
            music = Music.query.get(music_id)
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
        return jsonify([{'id': music.id, 'title': music.title, 'artist': music.artist} for music in recommendations])
    return jsonify({'message': 'User not found'})

@recommendation.route('/recommend/nmf', methods=['GET'])
def get_recommendations_nmf():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if user:
        ratings = Rating.query.filter_by(user_id=user_id).all()
        music_ids = [rating.music_id for rating in ratings]
        music_features = []
        for music_id in music_ids:
            music = Music.query.get(music_id)
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
        return jsonify([{'id': music.id, 'title': music.title, 'artist': music.artist} for music in recommendations])
    return jsonify({'message': 'User not found'})

@recommendation.route('/recommend/rate', methods=['POST'])
def rate_music():
    user_id = request.json['user_id']
    music_id = request.json['music_id']
    rating = request.json['rating']
    user = User.query.get(user_id)
    music = Music.query.get(music_id)
    if user and music:
        rating_obj = Rating(user_id=user_id, music_id=music_id, rating=rating)
        db.session.add(rating_obj)
        db.session.commit()
        return jsonify({'message': 'Rating added successfully'})
    return jsonify({'message': 'User or music not found'})