-- Bank Recruitment Management System - Relational SQLite Schema
-- Compliant with Master Plan v2

PRAGMA foreign_keys = ON;

-- 1. Users table (Authentication & Roles)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('ADMIN', 'HR_OFFICER', 'CANDIDATE')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Candidate Profiles (Personal Details)
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK(gender IN ('MALE', 'FEMALE', 'OTHER')) NOT NULL,
  phone TEXT NOT NULL,
  category TEXT DEFAULT 'GENERAL' CHECK(category IN ('GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'PWD')),
  address TEXT NOT NULL,
  photo_url TEXT,
  signature_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Educational Qualifications
CREATE TABLE IF NOT EXISTS educational_qualifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  candidate_id INTEGER NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  qualification_level TEXT NOT NULL CHECK(qualification_level IN ('10th', '12th', 'Diploma', 'Graduation', 'Post Graduation', 'PhD')),
  degree_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  board_university TEXT NOT NULL,
  passing_year INTEGER NOT NULL,
  percentage_or_cgpa REAL NOT NULL,
  certificate_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Job Openings / Recruitment Posts
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  vacancies INTEGER NOT NULL DEFAULT 1,
  min_qualification TEXT NOT NULL,
  min_age INTEGER NOT NULL DEFAULT 20,
  max_age INTEGER NOT NULL DEFAULT 30,
  salary_grade TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN' CHECK(status IN ('DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED')),
  description TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Applications (With duplicate application constraint)
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_no TEXT UNIQUE NOT NULL,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
  candidate_id INTEGER NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Submitted' CHECK(status IN ('Submitted', 'Under Review', 'Shortlisted', 'Admit Card Issued', 'Exam Completed', 'Interview', 'Selected', 'Rejected')),
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id),
  review_notes TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, candidate_id)
);

-- 6. Exam Details
CREATE TABLE IF NOT EXISTS exams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  exam_date DATE NOT NULL,
  exam_time TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 120,
  total_marks REAL NOT NULL DEFAULT 100,
  passing_marks REAL NOT NULL DEFAULT 40,
  exam_centers TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Admit Cards
CREATE TABLE IF NOT EXISTS admit_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  roll_number TEXT UNIQUE NOT NULL,
  exam_center TEXT NOT NULL,
  reporting_time TEXT NOT NULL,
  instructions TEXT NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. Results
CREATE TABLE IF NOT EXISTS results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  marks_obtained REAL NOT NULL,
  rank INTEGER,
  is_qualified BOOLEAN NOT NULL DEFAULT 0,
  remarks TEXT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(application_id, exam_id)
);

-- 9. Announcements (Public & Broadcast)
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'RECRUITMENT' CHECK(category IN ('RECRUITMENT', 'EXAM', 'RESULT', 'GENERAL')),
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 10. Candidate Notifications (In-App Targeted Updates)
CREATE TABLE IF NOT EXISTS candidate_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  candidate_id INTEGER NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  target_id INTEGER,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

