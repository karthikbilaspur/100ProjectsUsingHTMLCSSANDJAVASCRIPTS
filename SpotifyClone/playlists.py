from flask import Blueprint, request, jsonify
from models import Playlist, Music, User
from app import db

playlist = Blueprint('playlist', __name__)

@playlist.route('/playlists', methods=['GET'])
def get_playlists():
    playlists = Playlist.query.all()
    return jsonify([{'id': playlist.id, 'name': playlist.name} for playlist in playlists])

@playlist.route('/playlists', methods=['POST'])
def create_playlist():
    name = request.json['name']
    user_id = request.json['user_id']
    user = User.query.get(user_id)
    if user:
        playlist = Playlist(name=name, user=user)
        db.session.add(playlist)
        db.session.commit()
        return jsonify({'message': 'Playlist created successfully'})
    return jsonify({'message': 'User not found'})

@playlist.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        return jsonify({'id': playlist.id, 'name': playlist.name, 'music': [music.title for music in playlist.music]})
    return jsonify({'message': 'Playlist not found'})

@playlist.route('/playlists/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        name = request.json['name']
        playlist.name = name
        db.session.commit()
        return jsonify({'message': 'Playlist updated successfully'})
    return jsonify({'message': 'Playlist not found'})

@playlist.route('/playlists/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        db.session.delete(playlist)
        db.session.commit()
        return jsonify({'message': 'Playlist deleted successfully'})
    return jsonify({'message': 'Playlist not found'})

@playlist.route('/playlists/<int:playlist_id>/music', methods=['POST'])
def add_music_to_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        music_id = request.json['music_id']
        music = Music.query.get(music_id)
        if music:
            playlist.music.append(music)
            db.session.commit()
            return jsonify({'message': 'Music added to playlist successfully'})
        return jsonify({'message': 'Music not found'})
    return jsonify({'message': 'Playlist not found'})

@playlist.route('/playlists/<int:playlist_id>/music', methods=['DELETE'])
def remove_music_from_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        music_id = request.json['music_id']
        music = Music.query.get(music_id)
        if music:
            playlist.music.remove(music)
            db.session.commit()
            return jsonify({'message': 'Music removed from playlist successfully'})
        return jsonify({'message': 'Music not found'})
    return jsonify({'message': 'Playlist not found'})