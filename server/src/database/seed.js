const bcrypt = require('bcryptjs');
const { db, get, run } = require('../config/db');

async function seed() {
  console.log('🌱 Seeding sample data for Bank Recruitment Portal...');

  // Helper password hash
  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 1. Seed Users
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, role) 
    VALUES (?, ?, ?)
  `);

  insertUser.run('admin@apexbank.com', defaultPasswordHash, 'ADMIN');
  insertUser.run('hr@apexbank.com', defaultPasswordHash, 'HR_OFFICER');
  insertUser.run('candidate@example.com', defaultPasswordHash, 'CANDIDATE');

  const adminUser = get('SELECT id FROM users WHERE email = ?', ['admin@apexbank.com']);
  const hrUser = get('SELECT id FROM users WHERE email = ?', ['hr@apexbank.com']);
  const candidateUser = get('SELECT id FROM users WHERE email = ?', ['candidate@example.com']);

  // 2. Candidate Profile
  const insertProfile = db.prepare(`
    INSERT OR IGNORE INTO candidate_profiles 
    (user_id, full_name, date_of_birth, gender, phone, category, address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertProfile.run(
    candidateUser.id,
    'John Doe',
    '1998-05-15',
    'MALE',
    '+91 9876543210',
    'GENERAL',
    '42 Financial District, Cyber Towers Road, Hyderabad, 500081'
  );

  const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [candidateUser.id]);

  // 3. Educational Qualifications
  const insertEdu = db.prepare(`
    INSERT INTO educational_qualifications 
    (candidate_id, qualification_level, degree_name, institution, board_university, passing_year, percentage_or_cgpa)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const existingEdu = get('SELECT count(*) as count FROM educational_qualifications WHERE candidate_id = ?', [profile.id]);
  if (existingEdu.count === 0) {
    insertEdu.run(profile.id, '10th', 'Secondary School Certificate', 'St. Xavier High School', 'CBSE', 2014, 88.5);
    insertEdu.run(profile.id, '12th', 'Higher Secondary Certificate', 'St. Xavier Junior College', 'State Board', 2016, 91.2);
    insertEdu.run(profile.id, 'Graduation', 'B.Tech in Computer Science', 'National Institute of Technology', 'NIT', 2020, 8.4);
  }

  // 4. Jobs
  const insertJob = db.prepare(`
    INSERT OR IGNORE INTO jobs 
    (job_code, title, department, vacancies, min_qualification, min_age, max_age, salary_grade, start_date, end_date, status, description, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertJob.run(
    'APEX-PO-2026',
    'Probationary Officer (Scale I)',
    'Retail & Corporate Banking',
    75,
    'Graduation in any discipline from a recognized University with minimum 60% aggregate',
    20,
    30,
    '₹65,000 - ₹78,000 / month (Basic + DA + HRA)',
    '2026-11-01',
    '2026-12-15',
    'OPEN',
    'Responsible for branch operations, customer acquisition, credit appraisal, and retail asset portfolios across national branch networks.',
    adminUser.id
  );

  insertJob.run(
    'APEX-IT-2026',
    'Specialist IT Officer (Scale II)',
    'IT & Information Security',
    20,
    'B.Tech / B.E in CS / IT / ECE or MCA with 1+ year experience in software engineering or cybersecurity',
    21,
    32,
    '₹82,000 - ₹95,000 / month (Scale II Officer)',
    '2026-11-05',
    '2026-12-20',
    'OPEN',
    'Oversee core banking application security, database administration, incident response, and cloud modernization projects.',
    adminUser.id
  );

  insertJob.run(
    'APEX-CLERK-2026',
    'Customer Service Associate (Clerical Cadre)',
    'Branch Operations',
    150,
    'Bachelor degree in any discipline with proficiency in local language and official working computer knowledge',
    20,
    28,
    '₹38,000 - ₹46,000 / month',
    '2026-11-01',
    '2026-11-30',
    'OPEN',
    'Handle front-office counters, cash receipts, NEFT/RTGS transaction authorization, KYC validation, and client queries.',
    adminUser.id
  );

  const poJob = get('SELECT id FROM jobs WHERE job_code = ?', ['APEX-PO-2026']);

  // 5. Sample Application
  const insertApp = db.prepare(`
    INSERT OR IGNORE INTO applications 
    (application_no, job_id, candidate_id, status, review_notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertApp.run('APP-2026-10492', poJob.id, profile.id, 'Admit Card Issued', 'Candidate satisfies all academic qualifications and age criteria.');

  const application = get('SELECT id FROM applications WHERE application_no = ?', ['APP-2026-10492']);

  // 6. Exam Details
  const insertExam = db.prepare(`
    INSERT OR IGNORE INTO exams 
    (job_id, exam_name, exam_date, exam_time, duration_minutes, total_marks, passing_marks, exam_centers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertExam.run(
    poJob.id,
    'Probationary Officer Preliminary Online Exam 2026',
    '2026-12-28',
    '09:30 AM - 10:30 AM',
    60,
    100,
    45,
    'Hyderabad, Bengaluru, Mumbai, Chennai, Delhi NCR, Kolkata'
  );

  const exam = get('SELECT id FROM exams WHERE job_id = ?', [poJob.id]);

  // 7. Admit Card
  if (application && exam) {
    const insertAdmit = db.prepare(`
      INSERT OR IGNORE INTO admit_cards 
      (application_id, exam_id, roll_number, exam_center, reporting_time, instructions)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertAdmit.run(
      application.id,
      exam.id,
      'ROLL-APEX-2026-08421',
      'Apex Digital Assessment Center, Zone B, Hitech City, Hyderabad',
      '08:30 AM',
      '1. Carry this printed admit card along with original government photo identity proof (Aadhaar / Passport / Voter ID).\n2. Electronic gadgets, smart watches, and calculators are strictly forbidden.\n3. Reporting time is 08:30 AM sharp; entry gates close at 09:15 AM.'
    );
  }

  // 8. Announcements
  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (title, category, content)
    VALUES (?, ?, ?)
  `);
  const existingAnnouncements = get('SELECT count(*) as count FROM announcements');
  if (existingAnnouncements.count === 0) {
    insertAnnouncement.run(
      'Official Notification: Apex Bank Recruitment Project 2026-27',
      'RECRUITMENT',
      'Applications are invited from dynamic eligible Indian citizens for appointment as Probationary Officers (Scale I) and Specialist Officers (Scale II). Read the detailed information brochure for eligibility limits and reservations.'
    );
    insertAnnouncement.run(
      'Pre-Examination Training and Syllabus Structure Released',
      'EXAM',
      'The detailed syllabus matrix for Quantitative Aptitude, Reasoning, English, and Banking Awareness is now published on the candidate portal.'
    );
  }

  // 9. Candidate Notifications
  const insertNotification = db.prepare(`
    INSERT INTO candidate_notifications (candidate_id, title, message)
    VALUES (?, ?, ?)
  `);
  const existingNotifs = get('SELECT count(*) as count FROM candidate_notifications WHERE candidate_id = ?', [profile.id]);
  if (existingNotifs.count === 0) {
    insertNotification.run(
      profile.id,
      'Admit Card Released',
      'Your admit card for the Probationary Officer Preliminary Exam (APEX-PO-2026) has been generated and is ready for download in your dashboard.'
    );
    insertNotification.run(
      profile.id,
      'Application Verified',
      'Your application APP-2026-10492 has passed preliminary verification successfully.'
    );
  }

  console.log('✅ Demo database seeded successfully!');
  console.log('🔑 Credentials:');
  console.log('   Admin: admin@apexbank.com / Password@123');
  console.log('   HR Officer: hr@apexbank.com / Password@123');
  console.log('   Candidate: candidate@example.com / Password@123');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };

