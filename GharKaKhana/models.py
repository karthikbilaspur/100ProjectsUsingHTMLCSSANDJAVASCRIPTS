import datetime
from flask_login import UserMixin
from app import db
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    role = db.Column(db.String(64), nullable=False)

    def __repr__(self):
        return f"User('{self.username}')"
    def __init__(self, username, email, password, role):
        self.username = username
        self.email = email
        self.password = Bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role
    
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __init__(self, name, price):
        self.name = name
        self.price = price


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')

    def __repr__(self):
        return f"Order('{self.customer_name}', '{self.order_date}', '{self.total}', '{self.status}')"
    