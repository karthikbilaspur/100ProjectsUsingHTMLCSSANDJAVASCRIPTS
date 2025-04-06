import unittest
from app import app, db
from models import User, MenuItem, Order, ShippingQuote
import stripe

class TestUserRegistration(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_user_registration(self):
        # Test user registration
        user = User(username='testuser', email='testuser@example.com', password='password')
        db.session.add(user)
        db.session.commit()
        self.assertEqual(User.query.count(), 1)

class TestMenuAndOrdering(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_menu_and_ordering(self):
        # Test menu and ordering
        menu_item = MenuItem(name='Test Item', price=10.99)
        db.session.add(menu_item)
        db.session.commit()
        self.assertEqual(MenuItem.query.count(), 1)

        order = Order(customer_name='Test Customer', total=10.99)
        db.session.add(order)
        db.session.commit()
        self.assertEqual(Order.query.count(), 1)

class TestPaymentProcessing(unittest.TestCase):
    def test_payment_processing(self):
        # Test payment processing
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=1000,
                currency='usd',
                payment_method_types=['card']
            )
            self.assertEqual(payment_intent.status, 'requires_payment_method')
        except stripe.error.CardError as e:
            self.fail(f"Payment processing failed: {e}")

class TestShippingIntegration(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_shipping_integration(self):
        # Test shipping integration
        shipping_quote = ShippingQuote(cost=5.99, method='USPS')
        db.session.add(shipping_quote)
        db.session.commit()
        self.assertEqual(ShippingQuote.query.count(), 1)

if __name__ == '__main__':
    unittest.main()