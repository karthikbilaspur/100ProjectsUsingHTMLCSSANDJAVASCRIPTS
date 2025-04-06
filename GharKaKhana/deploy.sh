# Create a new Heroku app
heroku create

# Install the Heroku CLI
pip install heroku

# Initialize a new Git repository
git init

# Add the Heroku app as a remote repository
heroku git:remote -a <app-name>

# Push the code to the Heroku app
git add .
git commit -m "Initial commit"
git push heroku main