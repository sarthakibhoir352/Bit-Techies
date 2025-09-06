# EcoFinds Frontend with Flask Backend Setup

This guide shows how to integrate the HTML/CSS/JS frontend with your Python Flask backend.

## 🔧 Backend Setup

### 1. Install Dependencies
```bash
pip install flask python-dotenv mysql-connector-python werkzeug
```

### 2. Create Database
```sql
CREATE DATABASE user_auth;

USE user_auth;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Environment Variables
Create `.env` file:
```env
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=user_auth
```

### 4. Run Flask Backend
```bash
python app.py
```
Backend will run on `http://localhost:5000`

## 🌐 Frontend Setup

### 1. Update API URL
In `script-backend.js`, update the API base URL if needed:
```javascript
const API_BASE_URL = 'http://localhost:5000'; // Your Flask server URL
```

### 2. Serve Frontend
You can serve the frontend in several ways:

**Option A: Simple HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server
```

**Option B: Open Directly**
- Just open `index-backend.html` in your browser
- Note: CORS might be an issue with file:// protocol

**Option C: Flask Static Files**
Add to your Flask app:
```python
from flask import send_from_directory

@app.route('/')
def index():
    return send_from_directory('path/to/frontend', 'index-backend.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('path/to/frontend', path)
```

## 🔄 How It Works

### Authentication Flow
1. **Login**: Frontend sends username/password to `/login`
2. **Backend**: Validates credentials, creates session
3. **Frontend**: Checks `/dashboard` to verify login status
4. **Session**: Maintained via Flask sessions (cookies)

### API Endpoints Used
- `POST /register` - User registration
- `POST /login` - User login
- `GET /dashboard` - Check if user is logged in
- `GET /logout` - User logout

### Data Storage
- **Backend**: User accounts, passwords (hashed)
- **Frontend**: Products, cart, purchases (localStorage)

## 🚀 Testing

### 1. Start Backend
```bash
python app.py
```

### 2. Start Frontend
```bash
# In another terminal
python -m http.server 8000
```

### 3. Open Browser
Navigate to `http://localhost:8000/index-backend.html`

### 4. Test Features
- Register a new account
- Login with existing account
- Browse products
- Add to cart
- Create product listings

## 🔒 Security Features

### Backend Security
- ✅ Password hashing with Werkzeug
- ✅ SQL injection prevention
- ✅ Session management
- ✅ Input validation

### Frontend Security
- ✅ No passwords stored in frontend
- ✅ Session-based authentication
- ✅ CORS handling
- ✅ Error handling

## 🐛 Troubleshooting

### CORS Issues
If you get CORS errors, add to your Flask app:
```python
from flask_cors import CORS
CORS(app, supports_credentials=True)
```

### Session Issues
Make sure Flask secret key is set:
```python
app.secret_key = "your-secret-key-here"
```

### Database Connection
Check your MySQL connection:
```python
# Test connection
try:
    db = mysql.connector.connect(**DB_CONFIG)
    print("Database connected successfully")
except mysql.connector.Error as err:
    print(f"Database connection failed: {err}")
```

## 📝 API Documentation

### POST /register
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

### POST /login
```json
{
    "username": "string",
    "password": "string"
}
```

### GET /dashboard
- Returns: `{"message": "Welcome username!"}`
- Status 401 if not logged in

### GET /logout
- Returns: `{"message": "Logged out successfully"}`

## 🔄 Frontend Changes Made

### 1. Authentication
- Removed localStorage for user data
- Added API calls to Flask backend
- Session-based authentication
- Proper error handling

### 2. Data Flow
- User auth: Backend (Flask)
- Products/cart: Frontend (localStorage)
- Session: Maintained by Flask

### 3. Error Handling
- Network error handling
- Backend error messages
- User feedback

## 🚀 Production Deployment

### Backend
- Use production WSGI server (Gunicorn)
- Set up proper database
- Configure environment variables
- Enable HTTPS

### Frontend
- Serve from web server (Nginx)
- Configure CORS properly
- Set up domain/subdomain

## 📋 Next Steps

1. **Add Product Management API**
   - Create endpoints for products
   - Move product data to database
   - Add image upload

2. **Add Cart/Purchase API**
   - Create cart endpoints
   - Add purchase tracking
   - User-specific data

3. **Enhance Security**
   - Add rate limiting
   - Input sanitization
   - CSRF protection

4. **Add Features**
   - Email verification
   - Password reset
   - User profiles
   - Product search

The frontend is now properly integrated with your Flask backend for secure authentication while maintaining all the original functionality!
