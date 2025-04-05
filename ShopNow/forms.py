from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, SubmitField
from wtforms.validators import DataRequired

class PaymentForm(FlaskForm):
    card_number = StringField("Card Number", validators=[DataRequired()])
    exp_month = IntegerField("Expiration Month", validators=[DataRequired()])
    exp_year = IntegerField("Expiration Year", validators=[DataRequired()])
    cvc = IntegerField("CVC", validators=[DataRequired()])
    submit = SubmitField("Pay")