from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///membership.db"
db = SQLAlchemy(app)

class Membership(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(20), nullable=False)
    membership_type = db.Column(db.String(50), nullable=False)

@app.route("/membership", methods=["POST"])
def submit_membership():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    name = data.get("name")
    email = data.get("email")
    phone = data.get("phone")
    membership_type = data.get("membership_type")

    if not name or not email or not phone or not membership_type:
        return jsonify({"error": "All fields are required"}), 400

    existing_membership = Membership.query.filter_by(email=email).first()
    if existing_membership:
        return jsonify({"error": "Email already exists"}), 400

    new_membership = Membership(
        name=name,
        email=email,
        phone=phone,
        membership_type=membership_type
    )
    db.session.add(new_membership)
    db.session.commit()

    return jsonify({"message": "Membership submitted successfully"}), 201

if __name__ == "__main__":
    app.run(debug=True)