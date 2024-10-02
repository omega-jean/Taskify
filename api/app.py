from flask import Flask, request, jsonify

app = Flask(__name__)

tasks = []
users = {
    "test@example.com": "password123"
}
tokens = {}

@app.route('/')
def home():
    return "Welcome to the Task API!", 200

@app.route('/api/authentication', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    
    if email in users and users[email] == password:
        token = f"token_{email}"
        tokens[email] = token
        return jsonify({"token": token}), 200
    return jsonify({"error": "Invalid credentials"}), 401

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
    
    title = input("Enter the title of the task: ")
    description = input("Enter the task description: ")
    
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
        title = input("Enter the new title of the task: ")
        description = input("Enter the new job description: ")
        
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
    app.run(debug=True)
