# 🎓 Scorely — AI-Powered Answer Sheet Evaluation System

![Version](https://img.shields.io/badge/version-1.3.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-success.svg)
![Theme](https://img.shields.io/badge/theme-light--classy-violet.svg)

**Scorely** is a state-of-the-art, production-ready web application designed for educational institutions. The platform streamlines the grading process by leveraging cutting-edge Large Language Models (LLMs) and Semantic Analysis to evaluate student answer sheets with human-like precision.

---

## 🌟 Key Innovations

### 🚀 Cutting-Edge AI Core
- **AI-Powered reference answer generation**: Reads exam question papers and generates detailed reference answers automatically.
- **Hybrid Evaluation Architecture**: Combines keyword matching with **Multilingual Semantic Similarity** (Sentence-Transformers) to understand the *meaning* behind student answers, not just exact keywords.

### 📊 Professional Administrative Control Center
- **Overview Dashboard**: A clean workspace for system metrics, including total sheets graded, evaluation rate, and average marks.
- **Interactive Portal**: Fully synchronized navigation tabs (Overview, Teachers, Subjects, Reports) that bind dynamically to browser query parameters.
- **Enterprise Management**: Onboard teachers, create subjects, and monitor average AI grading accuracy in real-time.

### 🕵️ Intelligent Integrity & Rigor
- **Grading Strictness Mode**: Choose between **Strict**, **Medium**, or **Lenient** rigor before starting the evaluation, adjusting the semantic matching thresholds.
- **Detail Feedback**: Delivers granular, question-by-question scoring and helpful explanations for every student sheet.

### ✉️ Live Contact Form
- **EmailJS Integration**: Integrated contact page connected directly to your email provider (e.g. Gmail) via EmailJS client-side SDK.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 18, Tailwind CSS (Classy Light Theme), Vite, Lucide Icons, EmailJS SDK |
| **Backend** | FastAPI (Python 3.10+), Pydantic v2 |
| **Database** | MongoDB Atlas with Beanie ODM |
| **AI/ML** | Advanced LLMs, Sentence-Transformers (`paraphrase-MiniLM-L6-v2`) |
| **Security** | JWT Authentication, Bcrypt Hashing, Role-Based Access Control (RBAC) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **MongoDB**: Atlas URI or Local instance

### 1. Backend Configuration
Navigate to the `backend/` directory, set up your Python environment, and start uvicorn:
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Create your .env file and set MONGODB_URL and GEMINI_API_KEY
cp .env.example .env

# Initialize database with pre-configured mock data (subjects, teachers, student answer sheets)
python scripts/seed_demo.py

# Start FastAPI backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*The backend server starts running on [http://localhost:8000](http://localhost:8000)*.

### 2. Frontend Configuration
Navigate to the `frontend/` directory, configure environment variables, and launch:
```bash
cd frontend
npm install

# Create a frontend/.env file and fill in your EmailJS keys
# Example keys:
# VITE_EMAILJS_SERVICE_ID=service_vwnajon
# VITE_EMAILJS_TEMPLATE_ID=template_jnc7qc3
# VITE_EMAILJS_PUBLIC_KEY=qoBDvhBPChruqtQ5T

npm run dev
```
*The frontend client starts running on [http://localhost:3000](http://localhost:3000)*.

---

## 📋 Credentials (Demo Data)

- **Admin Account**: 
  - **Email**: `admin@admin.com`
  - **Password**: `admin123`
- **Teacher Accounts**:
  - **Emails**: `teacher@test.com`, `priya@school.com`, `arjun@school.com`
  - **Password**: `teacher123`

---

## 📂 Project Architecture

```
Scorely/
├── backend/
│   ├── app/
│   │   ├── api/routes/    # High-performance REST endpoints (auth, admin, teacher)
│   │   ├── models/        # Asynchronous Beanie Document models (user, subject, paper, answer, evaluation)
│   │   ├── services/      # AI Core evaluation service
│   │   └── config.py      # App configurations
│   ├── scripts/
│   │   └── seed_demo.py   # Database seeder script
│   └── requirements.txt   # Pin-locked Python dependencies
├── frontend/
│   ├── public/            # Static assets (favicons, logos)
│   ├── src/
│   │   ├── components/    # Common widgets (Layout, Navbar, Footer)
│   │   ├── pages/         # Landing (Home, Features, About, Contact) & Dashboards (Admin/Teacher)
│   │   └── services/      # Type-safe Axios API Client
│   └── package.json
└── README.md
```

---

## 📜 License
Distributed under the MIT License.

---
*Built with ❤️ by humans for educators worldwide.*
