# gym/tests.py

from django.test import TestCase
from .models import Membership

class MembershipTestCase(TestCase):
    def test_membership_creation(self):
        membership = Membership.objects.create(name='John Doe', email='johndoe@example.com', phone='555-555-5555', membership_type='Basic')
        self.assertEqual(membership.name, 'John Doe')
        self.assertEqual(membership.email, 'johndoe@example.com')
        self.assertEqual(membership.phone, '555-555-5555')
        self.assertEqual(membership.membership_type, 'Basic')