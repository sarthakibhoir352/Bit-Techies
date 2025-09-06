<div align="center">
🌿 EcoFinds
  
- Sustainable Second-Hand Marketplace
🚀 A web application for buying and selling second-hand products sustainably.
(Front-end and back-end fully integrated — login, listings, cart, and profile management)

</div>

✨ Features:

🔐 Login & Registration (Flask + MySQL backend, password hashing)

🛒 Browse, add, and manage listings with images, categories, and prices

🔍 Search and filter products by category

💳 Shopping Cart: Add/remove products, view subtotal & total

📜 Purchase History for users

👤 Profile Management: Update username and email

🌙 Dark/Light Mode Toggle

📱 Mobile-Responsive Design with sidebar & bottom navigation


🚀 Getting Started:

Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/ecofinds.git
cd ecofinds
```
Install dependencies for the back-end:
```bash
pip install -r requirements.txt
```
Setup MySQL Database:
```bash
CREATE DATABASE ecofinds;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(512) NOT NULL
);
```
Run the Flask server:
```bash
python login.py
```
🌍 Deployment:

This project can be deployed on any Flask-supported hosting service or locally with MySQL:

Push your code to GitHub

Setup a hosting service (Heroku, PythonAnywhere, etc.)

Configure environment variables and database connection

📦 ecofinds:
```bash
 ┣ 📜 index.html            # Main front-end page
 ┣ 📜 styles.css            # Styling
 ┣ 📜 script-backend.js     # Front-end JS for API interactions
 ┣ 📜 app.py                # Flask backend server
 ┣ 📜 requirements.txt      # Python dependencies
 ┣ 📜 .env                  # Environment variables (DB credentials)
 ┗ 📜 README.md             # Project documentation
 ```

🛠️ Tech Stack:
Front-End: HTML, CSS, JavaScript, Font Awesome

Back-End: Python, Flask, MySQL

Security: Password hashing with Werkzeug

Local Storage: MySQL Database

CORS: Enabled for front-end/back-end communication

🙌 Contribution:

Contributions are welcome!

Fork the repo

Create a new branch (feature/new-idea)

Commit your changes

Open a Pull Request

Request

📜 License:

This project is open-source under the MIT License.

<div align="center">

💚 Made with love for a more sustainable world

</div>






