from flask import render_template, redirect, url_for, jsonify, request, Blueprint
from app import app, db
from forms import PaymentForm
from models import Product, Order, User, OrderItem, Recommendation, Rating
from authlib.integrations.flask_client import OAuth
from flask_login import login_user, logout_user, login_required, current_user

# OAuth setup
oauth = OAuth(app)
oauth.register(
    name='facebook',
    client_id='your_facebook_client_id',
    client_secret='your_facebook_client_secret',
    access_token_url='https://graph.facebook.com/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    api_base_url='https://graph.facebook.com/',
    client_kwargs={'scope': 'email'}
)

# Blueprints
orders = Blueprint('orders', __name__)
recommendations = Blueprint('recommendations', __name__)
ratings = Blueprint('ratings', __name__)
social_media = Blueprint('social_media', __name__)
auth = Blueprint('auth', __name__)

# Routes
@app.route("/")
def index() -> str:
    """Display the index page with all products."""
    products = Product.query.all()
    return render_template("index.html", products=products)

@app.route("/product/<int:product_id>")
def product(product_id: int) -> str:
    """Display a single product."""
    product = Product.query.get(product_id)
    return render_template("product.html", product=product)

@app.route("/cart")
@login_required
def cart() -> str:
    """Display the user's cart."""
    try:
        orders = Order.query.filter_by(user_id=current_user.id).all()
        products = [Product.query.get(order.product_id) for order in orders]
        return render_template("cart.html", products=products)
    except Exception as e:
        return render_template("error.html", error=e)

@app.route("/checkout", methods=["GET", "POST"])
@login_required
def checkout() -> str:
    """Handle the checkout process."""
    form = PaymentForm()
    if form.validate_on_submit():
        try:
            # Process payment
            return redirect(url_for("index"))
        except Exception as e:
            return render_template("error.html", error=e)
    return render_template("checkout.html", form=form)

# Orders
@orders.route('/orders', methods=['POST'])
def create_order() -> tuple:
    """Create a new order."""
    try:
        data = request.get_json()
        order = Order(user_id=data['user_id'], total=data['total'])
        db.session.add(order)
        db.session.commit()
        return jsonify({'message': 'Order created successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error creating order'}), 500

@orders.route('/orders/<int:order_id>/items', methods=['POST'])
def add_order_item(order_id: int) -> tuple:
    """Add an item to an existing order."""
    try:
        data = request.get_json()
        order_item = OrderItem(order_id=order_id, product_id=data['product_id'], quantity=data['quantity'])
        db.session.add(order_item)
        db.session.commit()
        return jsonify({'message': 'Order item added successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error adding order item'}), 500

# Recommendations
@recommendations.route('/products/<int:product_id>/recommendations', methods=['GET'])
def get_recommendations(product_id: int) -> tuple:
    """Get recommendations for a product."""
    try:
        recommendations = Recommendation.query.filter_by(product_id=product_id).all()
        return jsonify([{'product_id': r.recommended_product_id} for r in recommendations]), 200
    except Exception as e:
        return jsonify({'message': 'Error getting recommendations'}), 500

# Ratings
@ratings.route('/products/<int:product_id>/ratings', methods=['POST'])
def create_rating(product_id: int) -> tuple:
    """Create a new rating for a product."""
    try:
        data = request.get_json()
        rating = Rating(product_id=product_id, user_id=data['user_id'], rating=data['rating'])
        db.session.add(rating)
        db.session.commit()
        return jsonify({'message': 'Rating created successfully'}), 201
    except Exception as e:
        return jsonify({'message': 'Error creating rating'}), 500

@ratings.route('/products/<int:product_id>/ratings', methods=['GET'])
def get_ratings(product_id: int) -> tuple:
    """Get ratings for a product."""
    
# Social Media
@social_media.route('/login/facebook', methods=['GET'])
def login_facebook() -> str:
    """Login with Facebook."""
    return oauth.facebook.authorize(callback=url_for('authorized', _external=True))
@social_media.route('/login/facebook/authorized', methods=['GET'])
def authorized() -> tuple:
    """Handle Facebook authorization."""
    try:
        resp = oauth.facebook.authorized_response()
        if resp is None:
            return 'Access denied: reason={} error={}'.format(
                request.args['error_reason'],
                request.args['error_description']
            )
        session['oauth_token'] = (resp['access_token'], '')
        return jsonify({'token': resp['access_token']}), 200
    except Exception as e:
        return jsonify({'message': 'Error authorizing with Facebook'}), 500
# Authentication routes
@auth.route('/login', methods=['POST'])
def login() -> tuple:
    """Login a user."""
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and user.check_password(data['password']):
            login_user(user)
            return jsonify({'message': 'Logged in successfully'}), 200
        return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        return jsonify({'message': 'Error logging in'}), 500
@auth.route('/logout', methods=['POST'])
@login_required
def logout() -> tuple:
    """Logout a user."""
    try:
        logout_user()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error logging out'}), 500
# Error Handling
@app.errorhandler(404)
def page_not_found(e) -> tuple:
    """Handle 404 errors."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e) -> tuple:
    """Handle 500 errors."""
    return render_template('500.html'), 500
# API Endpoints
# Register blueprints
app.register_blueprint(orders)
app.register_blueprint(recommendations)
app.register_blueprint(ratings)
app.register_blueprint(social_media)
app.register_blueprint(auth)
if __name__ == 'main':
    app.run(debug=True)
