# 🤝 Charity Connect — Donation Management System

A full-stack web application that connects donors with charitable organizations, allowing users to donate clothes, books, food, medicines, and more to those in need.

---

## 🌟 Features

### For Donors
- Register and log in securely
- Submit donation requests (clothes, books, food, medicines)
- View donation history

### For Admins
- Secure admin dashboard
- View and manage all donations
- Accept, reject, or mark donations as delivered
- Assign volunteers for pickup/delivery
- View donor and volunteer lists
- Contact message management

### For Volunteers
- View assigned donations
- Update delivery status

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer (Gmail SMTP) |
| Dev Tools | Concurrently, Nodemon |

---

## 📁 Project Structure

```
donation-system/
├── public/              # Static assets
├── server/              # Backend (Node/Express)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js        # Entry point
├── src/                 # Frontend (React)
│   ├── components/      # Reusable components
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   └── utils/           # Utility functions
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Snehagupta2405/donation-system.git
   cd donation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Set up environment variables**

   Create a `.env` file inside the `server/` folder:
   ```env
   PORT=5001
   JWT_SECRET=your_jwt_secret
   MONGO_URI=mongodb://127.0.0.1:27017/donationDB
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   MAIL_FROM="Charity Connect your_email@gmail.com"
   ```

4. **Run the app**
   ```bash
   npm start
   ```

   This starts both the React frontend (port 3000) and Express backend (port 5001) concurrently.

---

## 🔑 Default Roles

| Role | Access |
|---|---|
| `donor` | Submit donations |
| `admin` | Full dashboard access |
| `volunteer` | View and update assigned deliveries |

To set a user as admin, update their role in MongoDB:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## 📬 Contact

Built by [Sneha Gupta](https://github.com/Snehagupta2405)
