from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from werkzeug.security import generate_password_hash, check_password_hash
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:jeanroger2405@localhost/taskify'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(250), nullable=False)
    status = db.Column(db.String(50), default="pending")
    board_id = db.Column(db.Integer, ForeignKey('board.id'), nullable=True)
    board = db.relationship('Board', backref=db.backref('tasks', lazy=True))

class Board(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('user.user_id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    user = db.relationship('User', backref=db.backref('boards', lazy=True))

with app.app_context():
    db.create_all()

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
tokens = {}

def get_authenticated_user_email():
    token = request.headers.get('Authorization')
    email = next((email for email, t in tokens.items() if t == token), None)
    return email

def is_authenticated():
    token = request.headers.get('Authorization')
    return token and token in tokens.values()

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

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    base_username = email.split('@')[0]
    username = base_username
    count = 1

    while User.query.filter_by(username=username).first() is not None:
        username = f"{base_username}{count}"
        count += 1

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully", "username": username}), 201

@app.route('/api/authentication', methods=['POST'])
def login():
    email = request.json.get('email')
    password = str(request.json.get('password'))

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "Email not found"}), 404
    if not check_password_hash(user.password_hash, password):
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

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401
    tasks = Task.query.all()
    return jsonify([{"id": task.id, "title": task.title, "description": task.description, "status": task.status} for task in tasks]), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    title = data.get('title')
    description = data.get('description')
    board_id = data.get('board_id')

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400
    
    board = Board.query.get(board_id)
    if board is None:
        return jsonify({"error": "Board not found"}), 404

    new_task = Task(title=title, description=description, board_id=board_id)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"id": new_task.id, "title": new_task.title, "description": new_task.description, "status": new_task.status}), 201

@app.route('/api/tasks/<int:id>', methods=['GET'])
def get_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    task = Task.query.get(id)
    if task:
        return jsonify({"id": task.id, "title": task.title, "description": task.description, "status": task.status}), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    task = Task.query.get(id)
    if task:
        data = request.json
        title = data.get('title')
        description = data.get('description')

        if title:
            task.title = title
        if description:
            task.description = description

        db.session.commit()
        return jsonify({"id": task.id, "title": task.title, "description": task.description, "status": task.status}), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"error": "Task not found"}), 404

@app.route('/api/your-board', methods=['POST'])
def add_board():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    user_email = get_authenticated_user_email()
    user = User.query.filter_by(email=user_email).first()

    data = request.json
    board_name = data.get('name')

    if not board_name:
        return jsonify({"error": "Board name is required"}), 400

    new_board = Board(name=board_name, user_id=user.user_id)
    db.session.add(new_board)
    db.session.commit()

    return jsonify({"id": new_board.id, "name": new_board.name}), 201

@app.route('/api/your-board', methods=['GET'])
def get_boards():
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    user_email = get_authenticated_user_email()
    user = User.query.filter_by(email=user_email).first()

    boards = Board.query.filter_by(user_id=user.user_id).all()
    return jsonify([{"id": board.id, "name": board.name} for board in boards]), 200

@app.route('/api/your-board/<int:id>', methods=['DELETE'])
def delete_board(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    user_email = get_authenticated_user_email()
    user = User.query.filter_by(email=user_email).first()

    board = Board.query.filter_by(id=id, user_id=user.user_id).first()
    if board:
        db.session.delete(board)
        db.session.commit()
        return jsonify({"message": "Board deleted"}), 200
    return jsonify({"error": "Board not found"}), 404

@app.route('/api/your-board/<int:id>', methods=['PUT'])
def update_board(id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    user_email = get_authenticated_user_email()
    user = User.query.filter_by(email=user_email).first()

    board = Board.query.filter_by(id=id, user_id=user.user_id).first()
    if board:
        data = request.json
        board_name = data.get('name')

        if board_name:
            board.name = board_name

        db.session.commit()
        return jsonify({"id": board.id, "name": board.name}), 200
    return jsonify({"error": "Board not found"}), 404

@app.route('/api/your-board/<int:board_id>/task-manager', methods=['GET'])
def get_tasks_by_board(board_id):
    if not is_authenticated():
        return jsonify({"error": "Unauthorized"}), 401

    board = Board.query.get(board_id)
    if board is None:
        return jsonify({"error": "Board not found"}), 404

    tasks = Task.query.filter_by(board_id=board_id).all()
    return jsonify([{"id": task.id, "title": task.title, "description": task.description, "status": task.status} for task in tasks]), 200


if __name__ == '__main__':
    app.run(debug=True, port=5000)
