💼 Job Portal Web Application

A modern, full-stack Job Portal application where students can discover jobs and internships, apply to opportunities, and track their applications — while companies can post and manage job listings. Built with MERN Stack, TypeScript, Tailwind CSS, and more.

✨ Features

👤 Student Panel

🔍 Browse Jobs with filters by type, location, remote, etc.

📝 Apply to Jobs via a sleek modal form.

📄 My Applications page to view all applied jobs.

🔒 Secure login and signup with JWT Auth.

🏢 Company Panel (Upcoming)

🛠️ Create and manage job postings.

📊 View applicants for each job.

✏️ Edit or close job listings.

🧑‍💼 Admin Panel (Upcoming)

👁️‍🗨️ Manage users and companies.

❌ Block or delete suspicious activity.

📊 Dashboard overview (users, jobs, applications).

🔐 Authentication

✅ Signup required before login.

🔐 Passwords hashed with bcrypt.

🛡️ JWT-based authentication.

💅 UI/UX

🌙 Dark mode support.

⚡ Smooth transitions and animations.

🧩 Modular, reusable components.

🛠️ Tech Stack

Frontend

⚛️ React + TypeScript

🎨 Tailwind CSS

🍃 Zustand (for state management)

🔄 Axios (API calls)

Backend

🌐 Express.js + Node.js

🍃 MongoDB + Mongoose

🔐 JWT for authentication

🧂 bcrypt for password hashing

🚀 Upcoming Features

The following features are under development or planned:

📁 Resume upload and preview.

💬 Messaging system between applicants and recruiters.

📅 Interview scheduling feature.

🧠 AI-powered job recommendations.

🔔 Email notifications on job updates.

📈 Admin analytics dashboard.

🖼️ Screenshots

Include relevant UI screenshots here — jobs page, apply modal, applications view, etc.

📦 Setup Instructions

1. Clone the Repository

git clone https://github.com/your-username/Job-Portal.git
cd Job-Portal

2. Install Dependencies

# For backend
cd backend
npm install

# For frontend
cd ../frontend
npm install

3. Create .env Files

Create a .env file in both /backend and /frontend (if needed).

Backend .env example:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

4. Start the App

# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev


🤝 Acknowledgements

Thanks to all open-source libraries used.

Special thanks to GitGuardian for helping detect leaked secrets.
