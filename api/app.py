from flask import Flask

app = Flask(__name__)

tasks = []

@app.route('/')
def home():
    return "Welcome to the Task API!", 200

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return str(tasks), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    title = input("Enter the title of the task: ")
    description = input("Enter the task description: ")
    
    new_task = {
        "id": len(tasks) + 1,
        "title": title,
        "description": description,
        "status": "pending"
    }
    tasks.append(new_task)
    return str(new_task), 201

@app.route('/api/tasks/<int:id>', methods=['GET'])
def get_task(id):
    task = next((task for task in tasks if task["id"] == id), None)
    if task:
        return str(task), 200
    return "Task not found", 404

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = next((task for task in tasks if task["id"] == id), None)
    if task:
        title = input("Enter the new title of the task: ")
        description = input("Enter the new job description: ")
        
        if title:
            task["title"] = title
        if description:
            task["description"] = description
        
        return str(task), 200
    return "Task not found", 404

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task["id"] != id]
    return "Task deleted", 200


if __name__ == '__main__':
    app.run(debug=True)
