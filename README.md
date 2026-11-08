# Apex Bank - Recruitment Management System (BRMS)

> **Enterprise-Grade Digital Recruitment & Examination Portal**  
> Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js Express**, and **Native SQLite** (`node:sqlite`).

---

## 🏛️ System Overview

The **Bank Recruitment Management System (BRMS)** is a full-stack web application designed for banking and financial institutions to automate end-to-end personnel recruitment. It handles vacancy announcements, candidate eligibility verification, online application tracking, automated computer-based test (CBT) admit card issuance, result publishing, and administrative score review.

### Architecture Highlights
- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons.
- **Backend:** Node.js 26+, Express.js REST API (`/api/v1`), JWT authentication, bcrypt password hashing, input validation.
- **Database:** Zero-dependency relational **SQLite** powered by Node.js's native `DatabaseSync` engine (`server/src/database/recruitment.db`).
- **High Concurrency:** Configured with `PRAGMA journal_mode = WAL;` (Write-Ahead Logging) and enforced foreign key constraints (`PRAGMA foreign_keys = ON;`).

---

## 🚀 Quick Start Guide

### 1. One-Click Launch (Windows)
Double-click [`start.bat`](file:///d:/Project/Bank%20Management/start.bat) in the project root directory.  
It will automatically launch both the backend API server and frontend client in separate terminal windows.

### 2. Manual CLI Launch

#### Backend API (Port 5000):
```bash
cd server
npm run dev
# Healthcheck: http://localhost:5000/api/v1/health
```

#### Frontend Client (Port 5173):
```bash
cd client
npm run dev
# Web Portal: http://localhost:5173
```

---

## 🔑 Demo Login Accounts

All pre-seeded demo accounts share the universal password: **`Password@123`**

| Role | Email | Password | Primary Permissions & Capabilities |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@apexbank.com` | `Password@123` | Full recruitment oversight, post new vacancies, review candidate pool, issue admit cards, publish exam scores, export CSV roster. |
| **HR Officer** | `hr@apexbank.com` | `Password@123` | Review applicant qualification documents, update verification status, manage examination schedules. |
| **Candidate** | `candidate@example.com` | `Password@123` | Personal profile management, browse vacancies, apply with age/qualification checks, view e-Admit Card, check scorecards. |

> *Tip: The Login page also features one-click demo pill buttons to instantly populate credentials for fast testing.*

---

## 📊 Database Schema (11 Relational Tables)

All tables, indexes, and foreign keys are defined in [`server/src/database/schema.sql`](file:///d:/Project/Bank%20Management/server/src/database/schema.sql):

1. **`users`** – User identity, bcrypt credentials, and role enforcement (`ADMIN`, `HR_OFFICER`, `CANDIDATE`).
2. **`candidate_profiles`** – Personal details (full name, DOB, gender, phone, reservation category, address).
3. **`educational_qualifications`** – Academic records (10th, 12th, Diploma, Graduation, Post-Graduation, CGPA/percentage).
4. **`jobs`** – Job notifications, minimum qualifications, age boundaries (`min_age`, `max_age`), pay grades, and deadlines.
5. **`applications`** – Application records with composite unique constraint `UNIQUE(job_id, candidate_id)` preventing duplicate submissions.
6. **`exams`** – Examination details (exam name, date, time, duration, total marks, passing cutoff).
7. **`admit_cards`** – Automated e-Admit Cards linking candidates to assigned test centers and unique roll numbers.
8. **`results`** – Candidate scorecards, marks obtained, merit rank, and qualification verdict.
9. **`announcements`** – Public broadcast notices, syllabus releases, and general circulars.
10. **`candidate_notifications`** – Targeted in-app candidate alerts for status updates, admit card readiness, and results.
11. **`audit_logs`** – Security audit trail recording administrative actions, target entities, and timestamps.

---

## 🛡️ Security Features Implemented

- **Password Hashing:** Passwords hashed with `bcryptjs` using 10 salt rounds.
- **Stateless JWT Sessions:** Expiring JSON Web Tokens passed via HTTP `Authorization: Bearer <token>` header.
- **Strict Role-Based Access Control (RBAC):** Middleware checks `requireRole(['ADMIN', 'HR_OFFICER'])` on sensitive administrative endpoints.
- **Application Deadline Enforcement:** Application submission verifies `job.end_date >= CURRENT_DATE`; expired jobs are rejected automatically.
- **Age Eligibility Validation:** Mathematical age calculation at application time ensures candidate meets `job.min_age` and `job.max_age`.
- **Duplicate Prevention:** Database constraint `UNIQUE(job_id, candidate_id)` blocks repeated submissions for the same opening.

---

## 📡 REST API Reference (`/api/v1`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Candidate account & profile registration |
| `POST` | `/auth/login` | Public | Account authentication & JWT generation |
| `GET` | `/auth/me` | Authenticated | Fetch current user & profile record |
| `GET` | `/jobs` | Public | List open vacancies (supports `search` & `department` filter) |
| `POST` | `/jobs` | Admin / HR | Publish a new job vacancy |
| `POST` | `/applications/apply` | Candidate | Submit job application with eligibility checks |
| `GET` | `/applications/my-applications`| Candidate | Candidate's application history & admit card links |
| `GET` | `/applications` | Admin / HR | Full application roster (filter by job, status, candidate) |
| `PATCH` | `/applications/:id/status` | Admin / HR | Update application status & review notes |
| `GET` | `/admit-cards/application/:id`| Candidate/Admin | Fetch printable e-Admit Card |
| `POST` | `/admit-cards/issue` | Admin / HR | Generate roll number & issue admit card |
| `GET` | `/results/my-results` | Candidate | View examination scorecards & merit rank |
| `POST` | `/results/publish` | Admin / HR | Record and publish CBT marks |
| `GET` | `/notifications/announcements`| Public | Fetch broadcast notices |
| `GET` | `/analytics/dashboard` | Admin / HR | Recruitment summary metrics and breakdown counts |

---

## 📁 Project Directory Structure

```
d:\Project\Bank Management\
├── client/                      # React 19 + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/Navbar.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── JobsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AnnouncementsPage.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express API backend
│   ├── src/
│   │   ├── config/db.js         # SQLite database connection & helpers
│   │   ├── controllers/         # Modular business logic
│   │   ├── middleware/          # Auth & Role verification
│   │   ├── routes/              # Express API route handlers
│   │   ├── database/
│   │   │   ├── schema.sql       # 11 relational tables & constraints
│   │   │   ├── migrate.js       # Migration runner
│   │   │   ├── seed.js          # Demo seed data
│   │   │   └── recruitment.db   # SQLite database file
│   │   └── index.js             # Express server entry point
│   ├── .env
│   └── package.json
│
├── start.bat                    # One-click Windows launch script
├── package.json                 # Root npm script runner
└── README.md                    # Project documentation
```

