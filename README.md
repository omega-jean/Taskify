# Taskify

Taskify is a user-friendly task management application designed to help users organize, prioritize, and keep track of their daily tasks. The project combines a Python Flask back-end API with an Angular front-end and a MySQL database for efficient task management.

## 🎯 Features
Task Management: Easily add, edit, and delete tasks.
Secure Authentication: Provides safe access control for each user.
🛠️ Technologies Used
Backend: Python, Flask
Frontend: Angular
Database: MySQL
## 🏗️ Architecture
Taskify employs a layered architecture to separate responsibilities:

Frontend: An Angular application that manages the user interface and sends HTTP requests to the API.
Backend: A Flask API that processes requests from the frontend, handling users, tasks, and authentication.
Database: MySQL stores user and task data securely.
## 🚀 Installation
Prerequisites
Python 3 and pip for running the Flask API.
MySQL for database management.
Steps
Clone the repository:

git clone https://github.com/omega-jean/Taskify
cd Taskify
Backend Setup:

Navigate to the backend folder:
cd api.py
Install dependencies:
pip install -r requirements.txt
Configure your MySQL database.
Create a .env file to store environment variables (e.g., MySQL connection details).
Frontend Setup:

Navigate to the frontend folder:
cd Angular/taskify-frontend/src/app
Install dependencies:
npm install
## 💻 Usage
Start the backend:

python app.py
Start the frontend:

ng serve
Open the application in your browser at http://localhost:4200.

## 📋 API Overview
Here is a summary of the main API routes:

/api/tasks:

GET: Retrieves the user’s task list.
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
## 👥 Contributors
Jean-Alexandre Roger - Creator and Lead Developer

## 🔗 Links
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jean-alexandre-roger/)\
[Landingpage](https://portfolio-taskify.netlify.app/)\
[Blog of Taskify](https://www.linkedin.com/pulse/blog-taskify-jean-alexandre-roger-s4lkc/)
