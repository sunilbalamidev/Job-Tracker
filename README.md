# 🧾 Job Tracker (MERN Stack)

A full-stack job tracking web application that allows users to register, log in (via email or Google), and manage job applications in one central place. Built with the MERN stack using modern tools and deployed entirely to the cloud.

> 🔥 **Live Demo:** [https://job-tracker-client-cqyn.onrender.com](https://job-tracker-client-cqyn.onrender.com)

---

## 🚀 Features

✅ Register & Login (JWT Auth)  
✅ Google OAuth Sign-In  
✅ Protected Dashboard  
✅ Add, Edit, Delete Jobs  
✅ Filter Jobs by Status & Type  
✅ Job Application Analytics (Charts/Stats)  
✅ Responsive UI with Tailwind + Framer Motion  
✅ Fully Deployed via [Render](https://render.com)

---

## 🔧 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Framer Motion

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- CORS & dotenv

**Deployment:**
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

---

## ✨ Screenshots

| Landing Page                                                                                                                              | Dashboard View                                                                                                                              | Add Job Form                                                                                                                               | Login Page                                                                                                                               |
|-------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| <img width="944" alt="Landing Page" src="https://github.com/user-attachments/assets/455d6a82-c7b5-4721-bbb5-99772c2353fd" />              | <img width="941" alt="Dashboard View" src="https://github.com/user-attachments/assets/0e1d1fb1-ecae-40ea-a200-74691e4bebcc" />              | <img width="959" alt="Add Job Form" src="https://github.com/user-attachments/assets/7e89866b-1f55-4c74-b317-3fb5d6013569" />              | <img width="862" alt="Login Page" src="https://github.com/user-attachments/assets/579e4f4c-0360-4436-b180-fb821efad50e" />              |

---

## 🛠️ Local Setup

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-tracker.git
cd job-tracker
```
### 2. Setup the backend
```bash
cd job-tracker-server
npm install
```
Create a .env file inside the job-tracker-server folder with the following contents:
```
PORT=5000

# MongoDB Atlas URI
MONGO_URI=your_mongodb_connection_string

# JWT secret for token signing
JWT_SECRET=yourSuperSecretJWTKey

# Google OAuth credentials — create at https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Local callback for Google OAuth (change in production)
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```
```bash
npm run dev
```
Backend should now be running at:
👉 http://localhost:5000

### 3. Setup the frontend
```bash
cd ../job-tracker-client
npm install
```
Create a .env file inside the job-tracker-client folder with the following content:
```bash
VITE_API_URL=http://localhost:5000
```

Frontend will be running at:
👉 http://localhost:5173


