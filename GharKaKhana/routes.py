from flask import render_template, redirect, url_for, request
from flask_login import login_user, logout_user, login_required
from sqlalchemy import func
from app import app, db
from models import User, MenuItem, Contact, Order
from flask_mail import Mail, Message
from flask import Blueprint, render_template, request, jsonify
from app.models import User, Product, Order
from app.forms import RegistrationForm, LoginForm
from app import db, bcrypt
import requests
import stripe


# Initialize Stripe and Mail
stripe.api_key = 'YOUR_STRIPE_API_KEY'
mail = Mail(app)
main = Blueprint('main', __name__)

# Define routes
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    menu_items = MenuItem.query.all()
    contacts = Contact.query.all()
    return render_template('dashboard.html', menu_items=menu_items, contacts=contacts)

@app.route('/dashboard/menu_items')
@login_required
def dashboard_menu_items():
    menu_items = MenuItem.query.all()
    return render_template('dashboard_menu_items.html', menu_items=menu_items)

@app.route('/dashboard/contacts')
@login_required
def dashboard_contacts():
    contacts = Contact.query.all()
    return render_template('dashboard_contacts.html', contacts=contacts)

@app.route('/payment', methods=['GET', 'POST'])
def payment():
    if request.method == 'POST':
        try:
            # Create a PaymentIntent with the order amount and currency
            payment_intent = stripe.PaymentIntent.create(
                amount=1000,
                currency='usd',
                payment_method_types=['card']
            )

            # Create a PaymentMethod
            payment_method = stripe.PaymentMethod.create(
                type='card',
                card={
                    'number': request.form['card_number'],
                    'exp_month': request.form['exp_month'],
                    'exp_year': request.form['exp_year'],
                    'cvc': request.form['cvc']
                }
            )

            # Confirm the PaymentIntent
            stripe.PaymentIntent.confirm(
                payment_intent.id,
                payment_method=payment_method.id
            )

            # Redirect to the order confirmation page
            return redirect(url_for('order_confirmation'))
        except Exception as e:
            # Handle payment errors
            print(f"Error: {e}")
            return render_template('payment_error.html')

    return render_template('payment.html')

@app.route('/order_confirmation')
def order_confirmation():
    # Send email notification
    msg = Message('Order Confirmation', sender='your_email@gmail.com', recipients=['customer_email@gmail.com'])
    msg.body = 'Thank you for your order!'
    mail.send(msg)
    return render_template('order_confirmation.html')

@app.route('/orders')
@login_required
def orders():
    orders = Order.query.all()
    return render_template('orders.html', orders=orders)

@app.route('/orders/<int:order_id>/update_status', methods=['POST'])
@login_required
def update_order_status(order_id):
    order = Order.query.get(order_id)
    if order:
        order.status = request.form['status']
        db.session.commit()
        return redirect(url_for('orders'))
    return 'Order not found', 404

@app.route('/payment_success')
def payment_success():
    # Send email notification
    msg = Message('Payment Success', sender='your_email@gmail.com', recipients=['customer_email@gmail.com'])
    msg.body = 'Your payment was successful!'
    mail.send(msg)
    return render_template('payment_success.html')

@app.route('/shipping_quote')
def shipping_quote():
    try:
        # Get shipping quote from ShipStation
        url = 'https://api.shipstation.com/v1/shipments'
        headers = {'Authorization': 'Bearer YOUR_SHIPSTATION_API_KEY'}
        data = {'from': {'name': 'Your Name', 'address1': 'Your Address'}, 'to': {'name': 'Customer Name', 'address1': 'Customer Address'}}
        response = requests.post(url, headers=headers, json=data)
        shipping_quote = response.json()['shippingQuote']
        return render_template('shipping_quote.html', shipping_quote=shipping_quote)
    except Exception as e:
        # Handle shipping quote errors
        print(f"Error: {e}")
        return render_template('shipping_quote_error.html')

@app.route('/print_shipping_label')
def print_shipping_label():
    try:
        # Print shipping label from ShipStation
        url = 'https://api.shipstation.com/v1/shipments/label'
        headers = {'Authorization': 'Bearer YOUR_SHIPSTATION_API_KEY'}
        data = {'shipmentId': 'YOUR_SHIPMENT_ID'}
        response = requests.post(url, headers=headers, json=data)
        shipping_label = response.json()['shippingLabel']
        return render_template('shipping_label.html', shipping_label=shipping_label)
    except Exception as e:
        # Handle shipping label errors
        print(f"Error: {e}")
        return render_template('shipping_label_error.html')

@app.route('/pay_shipping', methods=['POST'])
def pay_shipping():
    try:
        # Get shipping cost from request
        shipping_cost = request.form['shipping_cost']

        # Create a PaymentIntent with the shipping cost
        payment_intent = stripe.PaymentIntent.create(
            amount=shipping_cost,
            currency='usd',
            payment_method_types=['card']
        )

        # Create a PaymentMethod
        payment_method = stripe.PaymentMethod.create(
            type='card',
            card={
                'number': request.form['card_number'],
                'exp_month': request.form['exp_month'],
                'exp_year': request.form['exp_year'],
                'cvc': request.form['cvc']
            }
        )

        # Confirm the PaymentIntent
        stripe.PaymentIntent.confirm(
            payment_intent.id,
            payment_method=payment_method.id
        )

        # Update order status to "shipped"
        order = Order.query.get(request.form['order_id'])
        order.status = 'shipped'
        db.session.commit()

        return redirect(url_for('order_confirmation'))
    except Exception as e:
        # Handle payment errors
        print(f"Error: {e}")
        return render_template('payment_error.html')

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data, password=form.password.data, role='user')
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('main.login'))
    return render_template('register.html', form=form)

@main.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            return redirect(url_for('main.dashboard'))
    return render_template('login.html', form=form)

@main.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@main.route('/products', methods=['POST'])
def add_product():
    product = Product(name=request.json['name'], price=request.json['price'])
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict())

@main.route('/products/<int:product_id>', methods=['PUT'])
def edit_product(product_id):
    product = Product.query.get(product_id)
    product.name = request.json['name']
    product.price = request.json['price']
    db.session.commit()
    return jsonify(product.to_dict())

@main.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    product = Product.query.get(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

@main.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    results = Product.query.filter(Product.name.like('%' + query + '%')).all()
    return jsonify([product.to_dict() for product in results])

@main.route('/reports', methods=['GET'])
def reports():
    sales = Order.query.filter(Order.status == 'completed').count()
    revenue = Order.query.filter(Order.status == 'completed').with_entities(func.sum(Order.total)).scalar()
    return jsonify({'sales': sales, 'revenue': revenue})

class MenuItem:
    def __init__(self, name, description, price, image):
        self.name = name
        self.description = description
        self.price = price
        self.image = image

menu_items = [
    MenuItem("Chicken Tikka Masala", "Marinated chicken cooked in a rich and creamy tomato sauce", 15.99, "chicken_tikka_masala.jpg"),
    MenuItem("Palak Paneer", "Spinach and paneer cheese in a creamy sauce", 14.99, "palak_paneer.jpg"),
    MenuItem("Samosas", "Crispy fried or baked pastries filled with spiced potatoes and peas", 8.99, "samosas.jpg"),
    MenuItem("Naan Bread", "Leavened, butter-topped flatbread", 4.99, "naan_bread.jpg"),
    MenuItem("Gulab Jamun", "Deep-fried dumplings soaked in a sweet syrup", 6.99, "gulab_jamun.jpg")
]
@main.route('/')
def index():
    return render_template('index.html')

@main.route('/menu')
def menu():
    return render_template('menu.html', menu_items=menu_items)

@main.route('/menu/<int:item_id>')
def menu_item(item_id):
    item = menu_items[item_id]
    return render_template('menu_item.html', item=item)

# Run the application
if __name__ == '__main__':
    app.run(debug=True)
    
    