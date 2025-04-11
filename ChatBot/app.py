from flask import Flask, render_template, request, redirect, url_for
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired
import nltk
from nltk.stem.lancaster import LancasterStemmer
import numpy
import tflearn
import tensorflow
import random
import json
import pickle
import requests
import os
import sqlite3


app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class ChatForm(FlaskForm):
    input_text = StringField('Input Text', validators=[InputRequired()])

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        return redirect(url_for('chat'))
    return render_template('login.html', form=form)

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    form = ChatForm()
    if form.validate_on_submit():
        input_text = form.input_text.data
        response = process_input_text(input_text)
        return render_template('response.html', input_text=input_text, response=response)
    return render_template('chat.html', form=form)

def process_input_text(input_text):
    # Load data from intents.json
    with open("intents.json") as file:
        data = json.load(file)

    # Load or create data.pickle
    try:
        with open("data.pickle", "rb") as f:
            words, labels, training, output = pickle.load(f)
    except:
        words, labels, training, output = create_data_pickle(data)

    # Load or create model.tflearn
    try:
        model = tflearn.DNN(load_model())
    except:
        model = create_model(training, output)

    # Process input text
    results = model.predict([bag_of_words(input_text, words)])
    results_index = numpy.argmax(results)
    tag = labels[results_index]

    # Get response from intents.json or WHO API
    response = get_response(tag, input_text, data)
    return response

def create_data_pickle(data):
    # Create words, labels, training, and output
    words = []
    labels = []
    docs_x = []
    docs_y = []

    for intent in data["intents"]:
        for pattern in intent["patterns"]:
            wrds = nltk.word_tokenize(pattern)
            words.extend(wrds)
            docs_x.append(wrds)
            docs_y.append(intent["tag"])

            if intent["tag"] not in labels:
                labels.append(intent["tag"])

    words = [stemmer.stem(w.lower()) for w in words if w != "?"]
    words = sorted(list(set(words)))

    labels = sorted(labels)

    training = []
    output = []

    out_empty = [0 for _ in range(len(labels))]

    for x, doc in enumerate(docs_x):
        bag = []

        wrds = [stemmer.stem(w.lower()) for w in doc]

        for w in words:
            if w in wrds:
                bag.append(1)
            else:
                bag.append(0)

        output_row = out_empty[:]
        output_row[labels.index(docs_y[x])] = 1

        training.append(bag)
        output.append(output_row)

    training = numpy.array(training)
    output = numpy.array(output)

    with open("data.pickle", "wb") as f:
        pickle.dump((words, labels, training, output), f)

    return words, labels, training, output

def load_model():
    # Load model.tflearn
    net = tflearn.input_data(shape=[None, len(training[0])])
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
    net = tflearn.regression(net)

    model = tflearn.DNN(net)
    model.load("model.tflearn")
    return model

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    form = ChatForm()
    if form.validate_on_submit():
        try:
            input_text = form.input_text.data
            response = process_input_text(input_text)
            return render_template('response.html', input_text=input_text, response=response)
        except Exception as e:
            return render_template('error.html', error=str(e))
    return render_template('chat.html', form=form)

def create_model(training, output):
    # Create model.tflearn
    net = tflearn.input_data(shape=[None, len(training[0])])
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, 8)
    net = tflearn.fully_connected(net, len(output[0]), activation="softmax")
    net = tflearn.regression(net)

    model = tflearn.DNN(net)
    model.fit(training, output, n_epoch=1000, batch_size=8, show_metric =True)
    model.save("model.tflearn")
    return model

def bag_of_words(s, words):
    bag = [0 for _ in range(len(words))]

    s_words = nltk.word_tokenize(s)
    s_words = [stemmer.stem(word.lower()) for word in s_words]

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1
            
    return numpy.array(bag)

def get_response(tag, input_text, data):
    # Get response from intents.json or WHO API
    for intent in data["intents"]:
        if intent["tag"] == tag:
            responses = intent["responses"]
            break

    # WHO API integration
    api_url = "https://api.who.int/diseases"
    params = {
        "q": input_text
    }
    headers = {
        "Authorization": f"Bearer {os.environ.get('WHO_API_KEY')}"
    }

    response = requests.get(api_url, params=params, headers=headers)
    if response.status_code == 200:
        disease_data = response.json()
        if disease_data["diseases"]:
            disease_name = disease_data["diseases"][0]["name"]
            disease_description = disease_data["diseases"][0]["description"]
            response_text = f"Disease: {disease_name}\nDescription: {disease_description}"
            return response_text
        else:
            return random.choice(responses)
    else:
        return random.choice(responses)

# Create a connection to the database
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# Use prepared statements to prevent SQL injection attacks
cursor.execute('SELECT * FROM users WHERE username = ?', (username,))

if __name__ == '__main__':
    app.run(debug=True)