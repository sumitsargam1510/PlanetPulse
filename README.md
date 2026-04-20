# 🌍 PlanetPulse

PlanetPulse is a full-stack carbon footprint tracking web application designed to help users monitor, reduce, and gamify their environmental impact.

It goes beyond simple tracking by introducing **gamification features** like streaks, eco-points, leaderboard, and daily eco missions to encourage sustainable habits.

---

## 🚀 Live Vision

> “Track your carbon. Change your habits. Save the planet.”

---

## ✨ Features

### 🌿 Carbon Tracking

* Track emissions from:

  * 🚗 Driving
  * ⚡ Electricity
  * ✈️ Flights
* Real-time CO₂ calculation

---

### 🔐 Authentication

* JWT-based secure login/signup
* User-specific data storage
* Protected routes

---

### 📊 Dashboard & Analytics

* Total CO₂ emissions
* Activity history
* Interactive pie chart visualization

---

### 🎮 Gamification System

* 🔥 Daily Streaks
* 🪙 Eco Points
* 🏆 Leaderboard (Top users)
* 🌱 Daily Eco Missions

---

### 👤 User Profile

* Name, Email, Age
* Personalized stats
* Carbon activity summary

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* Recharts

### Backend

* Spring Boot
* Spring Security (JWT)
* JPA / Hibernate
* MySQL

---

## 📂 Project Structure

```
PlanetPulse/
│
├── planetpulse-frontend/     # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── planetpulse-backend/      # Spring Boot Backend
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Clone Repository

```bash
git clone https://github.com/sumitsargam1510/PlanetPulse.git
cd PlanetPulse
```

---

### 🔹 Backend Setup (Spring Boot)

```bash
cd planetpulse-backend
mvn clean install
mvn spring-boot:run
```

> Runs on: http://localhost:8080

---

### 🔹 Frontend Setup (React)

```bash
cd planetpulse-frontend
npm install
npm run dev
```

> Runs on: http://localhost:5173

---

## 🔑 API Highlights

```
POST   /api/auth/register        # Register user
POST   /api/auth/login           # Login user

GET    /api/users/me             # Current user profile

POST   /api/emissions/calculate  # Add emission
GET    /api/emissions/history    # User history
GET    /api/emissions/total      # Total CO₂

GET    /api/leaderboard          # Top users

GET    /api/missions/daily       # Daily mission
POST   /api/missions/complete/{id} # Complete mission
```

---

## 🌟 Future Improvements

* 🌍 Carbon Budget System (weekly limits)
* 🎯 Weekly Challenges
* 🤖 AI-based Carbon Coach
* 📱 Mobile App Version
* ☁️ Cloud Deployment

---

## 👨‍💻 Author

**Sumit Sargam**
**Samriddhi Srivastava**

* GitHub: https://github.com/sumitsargam1510
* LinkedIn: https://www.linkedin.com/in/sumit-sargam-6209a9334/

---

## 💡 Note

This project is built as a **portfolio-ready full-stack application** demonstrating:

* Backend engineering (Spring Boot + JWT)
* Frontend development (React + Tailwind)
* Real-world product thinking (gamification + behavior change)

---

⭐ If you like this project, consider giving it a star!
