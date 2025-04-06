from flask import jsonify

def not_found(error):
    return jsonify({'error': 'Not found'}), 404

def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500