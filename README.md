# 📌 Job Tracker – Full-Stack Application

A **functionality-focused job application tracking system** built with the MERN stack.  
Designed to help users **track job applications efficiently**, with a clean UI, real authentication, and a demo mode for exploration.

---

## 🚀 Live Demo

- **Frontend:**  
  https://job-tracker-client-p7hd.onrender.com/

- **Backend API:**  
  https://job-tracker-c2cl.onrender.com/

---

## ✨ Features

### 🔐 Authentication
- Email & password authentication (JWT)
- Google Sign-In (OAuth 2.0)
- Secure protected routes

### 🧪 Demo Mode (No Signup Required)
- Try the full app without creating an account
- CRUD operations stored in **localStorage**
- Seamless switch to real mode when logging in

### 📊 Job Tracking
- Create, edit, delete job applications
- Status tracking:
  - Applied
  - Interview
  - Rejected
  - Offer
- Job types:
  - Full-time
  - Part-time
  - Internship
  - Contract

### 🔎 Productivity Tools
- Search by role or company
- Filter by status & job type
- Sort by date or alphabetically
- Dashboard statistics & charts

### ⚙️ Account Management
- Update profile
- Change password
- Delete account (removes all jobs)

---

## 🧠 Philosophy

> **Functionality over flash.**  
> The UI is clean, minimal, and intentional — focused on real workflows rather than visual noise.

This project demonstrates:
- Real-world authentication flows
- Scalable API design
- Practical frontend architecture
- Production-ready deployment

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- React Router
- Tailwind CSS
- Axios
- Chart.js
- Google OAuth (client)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- bcrypt (password hashing)

### Deployment
- Frontend: **Render**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## 🗂️ Project Structure

### Frontend
```txt
src/
├─ api/
├─ components/
├─ context/
├─ layouts/
├─ pages/
├─ services/
└─ utils/
```
### Backend
```txt
server/
├─ config/
├─ middleware/
├─ models/
├─ routes/
└─ server.js
```

### Backend (.env)
```txt
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend (.env)
```txt
VITE_API_URL=https://your-backend-url
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```
## Local Development
### Backend
```txt
cd job-tracker-server
npm install
npm run dev
```
### Frontend
```txt
cd job-tracker-client
npm install
npm run dev
```
## 🧩 Demo Mode Explained
- Click “Try Demo” on the landing page
- Demo data is stored locally in the browser
- No backend calls are made
- Logging in disables demo mode automatically

## 📈 Future Improvements
- Job notes & reminders
- CSV export
- Email follow-up reminders
- Analytics over time
- Role-based dashboards

## 👤 Author

**Sunil Balami**  
Software Engineer | Full-Stack | Integrations & Automation  

- GitHub: https://github.com/sunilbalamidev  
- Portfolio: https://sunilbalami-portfolio.vercel.app  
- LinkedIn: https://www.linkedin.com/in/sunilbalami  

