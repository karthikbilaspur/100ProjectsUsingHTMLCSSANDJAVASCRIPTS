from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_required, current_user
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Email, Length, EqualTo
import stripe

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)

# Define models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    orders = db.relationship('Order', backref='product', lazy=True)
    reviews = db.relationship('Review', backref='product', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Float, nullable=False)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=False)

# Define forms
class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    confirm_password = PasswordField('Confirm Password', validators=[InputRequired(), EqualTo('password')])
    submit = SubmitField('Register')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=20)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=80)])
    submit = SubmitField('Login')

class PaymentForm(FlaskForm):
    card_number = StringField('Card Number', validators=[InputRequired()])
    expiration_month = StringField('Expiration Month', validators=[InputRequired()])
    expiration_year = StringField('Expiration Year', validators=[InputRequired()])
    cvc = StringField('CVC', validators=[InputRequired()])
    submit = SubmitField('Pay')

# Define routes
@app.route('/')
def index():
    products = Product.query.all()
    return render_template('index.html', products=products)

@app.route('/product/<int:product_id>')
def product(product_id):
    product = Product.query.get(product_id)
    reviews = Review.query.filter_by(product_id=product_id).all()
    return render_template('product.html', product=product, reviews=reviews)

@app.route('/cart')
@login_required
def cart():
    orders = Order.query.filter_by(user_id=current_user.id).all()
    products = [Product.query.get(order.product_id) for order in orders]
    return render_template('cart.html', products=products)

@app.route('/checkout', methods=['POST'])
@login_required
def checkout():
    orders = Order.query.filter_by(user_id=current_user.id).all()
    total = sum(order.total for order in orders)
    payment_form = PaymentForm()
    if payment_form.validate_on_submit():
        # Process payment using Stripe
        stripe.api_key = 'stripe_api_key'
        try:
            charge = stripe.Charge.create(
                amount=int(total * 100),
                currency='usd',
                source='customer_source',
                description='Charge for order'
            )
            # Update order status
            for order in orders:
                order.status = 'paid'
                db.session.commit()
            return redirect(url_for('order_success'))
        except stripe.error.CardError as e:
    # Handle card errors
    return render_template('error.html', error='Card error')
except stripe.error.RateLimitError as e:
    # Handle rate limit errors
    return render_template('error.html', error='Rate limit error')
except stripe.error.InvalidRequestError as e:
    # Handle invalid request errors
    return render_template('error.html', error='Invalid request error')
except Exception as e:
    # Handle other errors
    return render_template('error.html', error='Error')

@app.route('/order_success')
@login_required
def order_success():
    return render_template('order_success.html')

@app.route('/review/<int:product_id>', methods=['POST'])
@login_required
def review(product_id):
    review_form = ReviewForm()
    if review_form.validate_on_submit():
        review = Review(
            product_id=product_id,
            user_id=current_user.id,
            rating=review_form.rating.data,
            review=review_form.review.data
        )
        db.session.add(review)
        db.session.commit()
        return redirect(url_for('product', product_id=product_id))

@app.route('/wishlist')
@login_required
def wishlist():
    wishlist = Wishlist.query.filter_by(user_id=current_user.id).all()
    products = [Product.query.get(wishlist.product_id) for wishlist in wishlist]
    return render_template('wishlist.html', products=products)

@app.route('/add_to_wishlist/<int:product_id>')
@login_required
def add_to_wishlist(product_id):
    wishlist = Wishlist(
        user_id=current_user.id,
        product_id=product_id
    )
    db.session.add(wishlist)
    db.session.commit()
    return redirect(url_for('product', product_id=product_id))

@app.route('/remove_from_wishlist/<int:product_id>')
@login_required
def remove_from_wishlist(product_id):
    wishlist = Wishlist.query.filter_by(user_id=current_user.id, product_id=product_id).first()
    db.session.delete(wishlist)
    db.session.commit()
    return redirect(url_for('wishlist'))

@app.route('/search', methods=['POST'])
def search():
    query = request.form['query']
    products = Product.query.filter(Product.name.like('%' + query + '%')).all()
    return render_template('search_results.html', products=products)

if __name__ == '__main__':
    app.run(debug=True)