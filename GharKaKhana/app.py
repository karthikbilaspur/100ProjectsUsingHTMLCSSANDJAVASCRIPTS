from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from app.routes import main
from app.models import db
from app.errors import not_found, internal_server_error
from app.notifications import mail
from app.security import sslify, bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gharkakhana.db'
db = SQLAlchemy(app)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = 'your_password'

class MenuItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(100), nullable=False)

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(200), nullable=False)

@app.route('/')
def index():
    menu_items = MenuItem.query.all()
    return render_template('index.html', menu_items=menu_items)

@app.route('/contact', methods=['POST'])
def contact():
    data = request.get_json()
    contact = Contact(name=data['name'], email=data['email'], message=data['message'])
    db.session.add(contact)
    db.session.commit()
    return jsonify({'message': 'Contact form submitted successfully'})

db.init_app(app)
mail.init_app(app)
sslify.init_app(app)
bcrypt.init_app(app)

app.register_blueprint(main)

@app.errorhandler(404)
def not_found_error(error):
    return not_found(error)

@app.errorhandler(500)
def internal_server_error_handler(error):
    return internal_server_error(error)

if __name__ == '__main__':
    app.run(debug=True)