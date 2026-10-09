# 📝 Stacknotes

**Your notes, your space, your productivity.**

Stacknotes is a full-stack note-taking web application that helps users organize and manage their notes in one place. It includes user authentication and note-management functionality, with a responsive web interface and a backend powered by Node.js, Express, and MongoDB.

🌐 **Live Demo:** [https://stacknotes.netlify.app/](https://stacknotes.netlify.app/)

## ✨ Features

- **User Authentication** — Register and log in with a username or email and password.
- **Secure Password Handling** — Password verification using bcrypt.
- **JWT Authentication** — Token-based authentication with cookie support.
- **Note Management** — Create, organize, and manage personal notes.
- **Categories** — Associate notes with categories.
- **Pin Notes** — Mark important notes for quick access.
- **Archive Notes** — Keep archived notes separate from active notes.
- **Soft Delete** — Mark notes as deleted without immediately removing them from the database.
- **Timestamps** — Track when records are created and updated.

## 🛠️ Tech Stack

### Frontend
- React
- JavaScript
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- Cookie Parser
- CORS
- Pino HTTP logging

### Deployment
- Netlify
- Netlify Functions
- `serverless-http`
- esbuild

## 🏗️ Architecture

Stacknotes uses a frontend-backend architecture:

1. The React frontend provides the user interface.
2. Axios sends HTTP requests to the backend API.
3. Express handles API routes, authentication, and note operations.
4. Mongoose manages data models and communication with MongoDB.
5. Netlify Functions runs the Express application in a serverless environment.

## 🚀 Live Application

Visit Stacknotes:

**[https://stacknotes.netlify.app/](https://stacknotes.netlify.app/)**

## ⚙️ Local Development

### Prerequisites

- Node.js and npm
- MongoDB database
- Git

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

Run the following command in the relevant frontend and backend directories:

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the backend directory and configure the variables required by your application.

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Use the actual variable name expected by your MongoDB connection code if it differs from `MONGODB_URI`.

**Security note:** Never commit `.env` files, database credentials, or JWT secrets to GitHub.

### 4. Start the backend

Run the command configured by your backend project:

```bash
npm start
```

### 5. Start the frontend

In the frontend directory, run:

```bash
npm run dev
```

Open the local URL shown by your frontend development server.

## 🔐 Security Considerations

- Passwords should be stored as secure hashes, never as plain text.
- JWT secrets and database credentials should be stored in environment variables.
- Production CORS settings should allow only trusted frontend origins.
- Authentication middleware should validate tokens before granting access to protected resources.
- Cookie settings should be configured appropriately for production HTTPS deployments.

## 📚 What I Learned

Building Stacknotes provided practical experience with:

- Developing REST APIs with Express.js.
- Designing MongoDB schemas using Mongoose.
- Implementing authentication with JWT and bcrypt.
- Managing cookies and cross-origin requests.
- Deploying a Node.js application through Netlify Functions.
- Debugging production issues involving CORS, serverless routing, and schema configuration.

## 👩‍💻 Author

Developed with ❤️ as a full-stack development project.

---

*Stacknotes — Capture your thoughts. Keep them organized.*
