Taskify
Taskify is a simple and intuitive task management application designed to help users organize, prioritize, and keep track of their daily tasks. It combines a Python Flask back-end API with an Angular front-end and a MySQL database for efficient task management.

Features
Add, edit, and delete tasks.
Secure authentication for user access.
Technologies Used
Backend: Python, Flask
Frontend: Angular
Database: MySQL
Architecture
Taskify uses a layered architecture to separate responsibilities:

Frontend: An Angular application handles the user interface and sends HTTP requests to the API.
Backend: A Flask API receives and processes requests from the frontend, managing users, tasks, and authentication.
Database: MySQL stores user and task data.
Installation
Prerequisites
Python 3 and pip to run the Flask API.
MySQL for the database.
Steps
Clone the repository:

git clone https://github.com/omega-jean/Taskify
cd taskify
Backend Setup:

Go to the backend folder:
cd api.py
Install dependencies:
pip install -r requirements.txt
Set up your MySQL database.
Create a .env file to store environment variables (e.g., MySQL connection details).
Frontend Setup:

Go to the frontend folder:
cd /Angular/taskify-frontend/src/app
Install dependencies:
npm install
Usage
Start the backend:

python app.py
Start the frontend:

ng serve
Access the application in your browser at http://localhost:4200.

API Overview
Here is a summary of the main API routes:

/api/tasks:

GET: Retrieves the user's task list.
POST: Creates a new task.
/api/tasks/{id}:

PUT: Updates an existing task.
DELETE: Deletes a task.
/api/user:

GET: Retrieves user information.
PUT: Updates user information.
/api/authentication:

POST: Authenticates the user (login).
DELETE: Logs the user out.
Contributors
Jean-Alexandre Roger - Creator and Lead Developer
License
This project is licensed under the MIT License.
