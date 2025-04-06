from flask_mail import Mail, Message

mail = Mail()

def send_notification(user, subject, body):
    msg = Message(subject, sender='your_email@gmail.com', recipients=[user.email])
    msg.body = body
    mail.send(msg)