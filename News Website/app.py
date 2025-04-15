# app.py
import os
from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, make_response
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, EqualTo
import requests
import secrets
from datetime import datetime
from sqlalchemy import desc

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") or "default_secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL") or "sqlite:///news.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Disable modification tracking

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = "login"

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    bookmarks = db.relationship('Bookmark', backref='user', lazy=True)

    def __init__(self, username, password, email):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode("utf-8")
        self.email = email

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False) # For SEO-friendly URLs
    description = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    published_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    url = db.Column(db.String(200), nullable=False)
    image = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'description': self.description,
            'published_at': self.published_at.isoformat(),
            'url': self.url,
            'image': self.image,
            'category_id': self.category_id
        }

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(100), nullable=False, unique=True)
    articles = db.relationship('Article', backref='category', lazy=True)

    def to_dict(self):
        return {'id': self.id, 'name': self.name, 'slug': self.slug}

class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'article_id', name='_user_article_uc'),)

# --- Forms ---
class LoginForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(), Length(min=2, max=20)])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Login")

class RegistrationForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField("Email", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    confirm_password = PasswordField("Confirm Password", validators=[DataRequired(), EqualTo("password")])
    submit = SubmitField("Register")

class ContactForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired()])
    message = db.Column(db.Text, nullable=False)
    submit = SubmitField("Send Message")

# --- User Loader ---
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- CSRF Protection ---
@app.before_request
def generate_csrf_token():
    if request.method == 'POST':
        token = request.headers.get('X-CSRF-Token')
        session_token = session.get('_csrf_token')
        if not token or token != session_token:
            abort(403)
    session['_csrf_token'] = session.get('_csrf_token') or secrets.token_hex(16)

@app.after_request
def set_csrf_cookie(response):
    if '_csrf_token' in session:
        response.set_cookie('csrf_token', session['_csrf_token'], httponly=True, samesite='Strict')
    return response

# --- Helper Functions ---
def generate_slug(text):
    return text.lower().replace(' ', '-').replace('[^\\w-]', '')

# --- Routes ---
@app.route("/")
def index():
    page = request.args.get('page', 1, type=int)
    per_page = 9
    articles = Article.query.order_by(Article.published_at.desc()).paginate(page=page, per_page=per_page)
    return render_template("index.html", articles=articles)

@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            next_page = request.args.get("next")
            return redirect(next_page) if next_page else redirect(url_for("index"))
        else:
            flash("Invalid username or password", "danger")
    return render_template("login.html", form=form)

@app.route("/register", methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for("index"))
    form = RegistrationForm()
    if form.validate_on_submit():
        if User.query.filter_by(username=form.username.data).first():
            flash("Username already taken", "danger")
        elif User.query.filter_by(email=form.email.data).first():
            flash("Email already registered", "danger")
        else:
            user = User(username=form.username.data, password=form.password.data, email=form.email.data)
            db.session.add(user)
            db.session.commit()
            flash("Account created successfully! You can now log in.", "success")
            return redirect(url_for("login"))
    return render_template("register.html", form=form)

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))

@app.route("/article/<slug>")
def article(slug):
    article = Article.query.filter_by(slug=slug).first_or_404()
    return render_template("article.html", article=article)

@app.route("/category/<slug>")
def category(slug):
    category = Category.query.filter_by(slug=slug).first_or_404()
    page = request.args.get('page', 1, type=int)
    per_page = 9
    articles = Article.query.filter_by(category=category).order_by(Article.published_at.desc()).paginate(page=page, per_page=per_page)
    return render_template("articles.html", articles=articles, category=category)

@app.route("/articles")
def articles():
    page = request.args.get('page', 1, type=int)
    per_page = 9
    articles = Article.query.order_by(Article.published_at.desc()).paginate(page=page, per_page=per_page)
    return render_template("articles.html", articles=articles, category=None)

@app.route("/categories")
def categories():
    categories = Category.query.all()
    return render_template("categories.html", categories=categories)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        flash("Your message has been sent!", "success") # In a real app, you'd send an email
        return redirect(url_for("contact"))
    return render_template("contact.html", form=form)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/search")
def search():
    query = request.args.get('q')
    results = []
    if query:
        results = Article.query.filter(Article.title.contains(query) | Article.description.contains(query) | Article.content.contains(query)).order_by(Article.published_at.desc()).all()
    return render_template("search.html", query=query, results=results)

@app.route("/bookmarks")
@login_required
def bookmarks():
    page = request.args.get('page', 1, type=int)
    per_page = 9
    bookmarks_pagination = Bookmark.query.filter_by(user_id=current_user.id).order_by(Bookmark.timestamp.desc()).paginate(page=page, per_page=per_page)
    bookmarked_articles = [bookmark.article for bookmark in bookmarks_pagination.items]
    return render_template("bookmarks.html", bookmarks=bookmarked_articles, pagination=bookmarks_pagination)

@app.route("/bookmark/<int:article_id>", methods=["POST"])
@login_required
def bookmark_article(article_id):
    article = Article.query.get_or_404(article_id)
    if not Bookmark.query.filter_by(user_id=current_user.id, article_id=article.id).first():
        bookmark = Bookmark(user_id=current_user.id, article_id=article.id)
        db.session.add(bookmark)
        db.session.commit()
        flash(f"'{article.title}' bookmarked!", "success")
    return redirect(request.referrer or url_for("article", slug=article.slug))

@app.route("/unbookmark/<int:article_id>", methods=["POST"])
@login_required
def unbookmark_article(article_id):
    article = Article.query.get_or_404(article_id)
    bookmark = Bookmark.query.filter_by(user_id=current_user.id, article_id=article.id).first()
    if bookmark:
        db.session.delete(bookmark)
        db.session.commit()
        flash(f"'{article.title}' removed from bookmarks!", "info")
    return redirect(request.referrer or url_for("article", slug=article.slug))

@app.route("/profile")
@login_required
def profile():
    return render_template("profile.html", user=current_user)

@app.route("/fetch_news")
def fetch_news():
    api_key = os.environ.get("NEWS_API_KEY")
    if not api_key:
        flash("News API key not configured.", "error")
        return redirect(url_for("index"))
    try:
        response = requests.get("https://newsapi.org/v2/top-headlines", params={"apiKey": api_key, "country": "in"}) # Fetching Indian news as per current location
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        if data and data.get("articles"):
            for article_data in data["articles"]:
                title = article_data.get("title")
                if title and not Article.query.filter_by(title=title).first():
                    slug = generate_slug(title)
                    description = article_data.get("description") or ""
                    content = article_data.get("content") or ""
                    published_at_str = article_data.get("publishedAt")
                    published_at = datetime.fromisoformat(published_at_str.replace('Z', '+00:00')) if published_at_str else datetime.utcnow()
                    url = article_data.get("url") or ""
                    image = article_data.get("urlToImage")
                    # Assign a default category (you might want a more sophisticated categorization)
                    default_category = Category.query.filter_by(name="General").first()
                    if not default_category:
                        default_category = Category(name="General", slug="general")
                        db.session.add(default_category)
                        db.session.commit()

                    new_article = Article(title=title, slug=slug, description=description, content=content, published_at=published_at, url=url, image=image, category=default_category)
                    db.session.add(new_article)
            db.session.commit()
            flash("Latest news fetched successfully!", "success")
        else:
            flash("Failed to fetch news or no articles found.", "warning")
    except requests.exceptions.RequestException as e:
        flash(f"Error fetching news: {e}", "danger")
    return redirect(url_for("index"))

@app.cli.command("initdb")
def initdb_command():
    """Initializes the database."""
    with app.app_context():
        db.create_all()
        print("Initialized the database.")
        # Create a default "General" category if it doesn't exist
        general_category = Category.query.filter_by(name="General").first()
        if not general_category:
            db.session.add(Category(name="General", slug="general"))
            db.session.commit()
            print("Created default 'General' category.")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)