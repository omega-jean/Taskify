from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

tasks = []
users = {}
tokens = {}

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@app.route('/')
def home():
    return "Welcome to the Task API!", 200

@app.route('/api/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = str(request.json.get('password'))
    confirm_password = str(request.json.get('confirmPassword'))

    if not re.match(EMAIL_REGEX, email):
        return jsonify({"error": "Invalid email format"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if email in users:
        return jsonify({"error": "Email already exists"}), 400

    users[email] = password

    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/authentication', methods=['POST'])
def login():
    email = request.json.get('email')
    password = str(request.json.get('password'))

    if email not in users:
        return jsonify({"error": "Email not found"}), 404
    elif users[email] != password:
        return jsonify({"error": "Incorrect password"}), 401

    token = f"token_{email}"
    tokens[email] = token
    return jsonify({"token": token}), 200

@app.route('/api/authentication', methods=['DELETE'])
def logout():
    token = request.headers.get('Authorization')
    email = next((email for email, t in tokens.items() if t == token), None)

    if email:
        del tokens[email]
        return jsonify({"message": "Logged out"}), 200
    return jsonify({"error": "Invalid token"}), 401

def is_authenticated():
    token = request.headers.get('Authorization')
    return token and token in tokens.values()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(tasks), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    new_task = {
        "id": len(tasks) + 1,
        "title": title,
        "description": description,
        "status": "pending"
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

@app.route('/api/tasks/<int:id>', methods=['GET'])
def get_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    task = next((task for task in tasks if task["id"] == id), None)
    if task:
        return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    task = next((task for task in tasks if task["id"] == id), None)
    if task:
        data = request.json
        title = data.get('title')
        description = data.get('description')

        if title:
            task["title"] = title
        if description:
            task["description"] = description

        return jsonify(task), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    global tasks
    tasks = [task for task in tasks if task["id"] != id]
    return jsonify({"message": "Task deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
