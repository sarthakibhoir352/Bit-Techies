from flask import Flask, request, jsonify, session
from dotenv import load_dotenv
load_dotenv()
import os
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret_key"

CORS(app, supports_credentials=True)

DB_CONFIG = {
    "host": "localhost",
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "user_auth")
}
db = mysql.connector.connect(**DB_CONFIG)
cursor = db.cursor(dictionary=True)


# ---------------- Registration ----------------


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    email = data['email']
    password = generate_password_hash(data['password'])

    try:
        cursor.execute(
            "INSERT INTO users1 (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        db.commit()
        return jsonify({
            "status": "success",
            "message": "User registered!",
            "username": username,
            "email": email  # <-- include email here
        })
    except mysql.connector.Error as err:
        return jsonify({"status": "error", "message": str(err)})


# ---------------- Login ----------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    cursor.execute("SELECT * FROM users1 WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.execute("SELECT * FROM users1 WHERE email = %s", (username,))
    user1 = cursor.fetchone()

    if user or user1:
        if user and check_password_hash(user['password'], password): 
            session['username'] = username
            return jsonify({"status": "success", "message": "Login successful!", "username": user['username'], "email": user['email']})
        elif user1 and check_password_hash(user1['password'], password): 
            session['username'] = username
            return jsonify({"status": "success", "message": "Login successful!", "email": user1['username'], "username": user1['email']})# email and username swapped
        else:
            return jsonify({"status": "error", "message": "Invalid credentials"})
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"})

    # if user and check_password_hash(user['password'], password):
    #     session['username'] = username
    #     return jsonify({"status": "success", "message": "Login successful!", "username": user['username'], "email": user['email']})
    # else:
    #     return jsonify({"status": "error", "message": "Invalid credentials"})


# ---------------- Dashboard (protected) ----------------
@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return jsonify({"message": f"Welcome {session['username']}!"})
    else:
        return jsonify({"message": "Please log in first."}), 401


# ---------------- Logout ----------------
@app.route('/logout')
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logged out successfully"})


if __name__ == '__main__':
    app.run(debug=True)