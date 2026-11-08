const { get, all, run, db } = require('../config/db');

function calculateAge(birthDate) {
  const dob = new Date(birthDate);
  const diff = Date.now() - dob.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

function applyToJob(req, res) {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    // 1. Fetch candidate profile
    const profile = get('SELECT * FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.status(400).json({ error: 'Please complete your candidate profile before applying.' });
    }

    // 2. Fetch Job details
    const job = get('SELECT * FROM jobs WHERE id = ?', [jobId]);
    if (!job) {
      return res.status(404).json({ error: 'Selected job notification was not found.' });
    }

    if (job.status !== 'OPEN') {
      return res.status(400).json({ error: 'This job recruitment window is currently closed.' });
    }

    // 3. Deadline Check
    const today = new Date().toISOString().split('T')[0];
    if (job.end_date < today) {
      return res.status(400).json({ error: `Application window closed on ${job.end_date}.` });
    }

    // 4. Duplicate Check
    const existing = get(
      'SELECT id, application_no FROM applications WHERE job_id = ? AND candidate_id = ?',
      [job.id, profile.id]
    );
    if (existing) {
      return res.status(409).json({
        error: `You have already applied for this position under Application No. ${existing.application_no}.`
      });
    }

    // 5. Age Eligibility Check
    const candidateAge = calculateAge(profile.date_of_birth);
    if (candidateAge < job.min_age || candidateAge > job.max_age) {
      return res.status(400).json({
        error: `Age criteria not met. Age must be between ${job.min_age} and ${job.max_age} years. Your age is ${candidateAge}.`
      });
    }

    // 6. Generate Application Number
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const applicationNo = `APP-${year}-${randomSuffix}`;

    // 7. Insert Application & Notification
    db.exec('BEGIN TRANSACTION;');
    try {
      const result = run(
        `INSERT INTO applications (application_no, job_id, candidate_id, status)
         VALUES (?, ?, ?, 'Submitted')`,
        [applicationNo, job.id, profile.id]
      );

      run(
        `INSERT INTO candidate_notifications (candidate_id, title, message)
         VALUES (?, ?, ?)`,
        [
          profile.id,
          'Application Submitted Successfully',
          `Your application for ${job.title} (${job.job_code}) has been received under registration number ${applicationNo}.`
        ]
      );

      db.exec('COMMIT;');

      const app = get('SELECT * FROM applications WHERE id = ?', [result.lastInsertRowid]);
      return res.status(201).json({
        message: 'Application submitted successfully.',
        application: app
      });
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  } catch (err) {
    console.error('applyToJob error:', err);
    return res.status(500).json({ error: 'Failed to process application.' });
  }
}

function getCandidateApplications(req, res) {
  try {
    const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.json({ applications: [] });
    }

    const apps = all(
      `SELECT 
        a.*,
        j.job_code,
        j.title as job_title,
        j.department as job_department,
        j.salary_grade,
        ac.id as admit_card_id,
        ac.roll_number,
        ac.exam_center,
        ac.reporting_time,
        r.marks_obtained,
        r.rank,
        r.is_qualified
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       LEFT JOIN admit_cards ac ON ac.application_id = a.id
       LEFT JOIN results r ON r.application_id = a.id
       WHERE a.candidate_id = ?
       ORDER BY a.applied_at DESC`,
      [profile.id]
    );

    return res.json({ applications: apps });
  } catch (err) {
    console.error('getCandidateApplications error:', err);
    return res.status(500).json({ error: 'Failed to fetch candidate applications.' });
  }
}

function getAllApplications(req, res) {
  try {
    const { jobId, status, search } = req.query;
    let query = `
      SELECT 
        a.*,
        j.job_code,
        j.title as job_title,
        j.department,
        cp.full_name as candidate_name,
        cp.phone as candidate_phone,
        cp.category as candidate_category,
        u.email as candidate_email,
        ac.roll_number
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN candidate_profiles cp ON a.candidate_id = cp.id
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN admit_cards ac ON ac.application_id = a.id
      WHERE 1=1
    `;
    const params = [];

    if (jobId) {
      query += ' AND a.job_id = ?';
      params.push(jobId);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (a.application_no LIKE ? OR cp.full_name LIKE ? OR u.email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY a.applied_at DESC';

    const applications = all(query, params);
    return res.json({ applications });
  } catch (err) {
    console.error('getAllApplications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications for administration.' });
  }
}

function updateApplicationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    const validStatuses = [
      'Submitted',
      'Under Review',
      'Shortlisted',
      'Admit Card Issued',
      'Exam Completed',
      'Interview',
      'Selected',
      'Rejected'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const app = get('SELECT * FROM applications WHERE id = ?', [id]);
    if (!app) {
      return res.status(404).json({ error: 'Application record not found.' });
    }

    run(
      `UPDATE applications SET
        status = ?,
        review_notes = COALESCE(?, review_notes),
        reviewed_by = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, review_notes, req.user.id, id]
    );

    // Send candidate notification regarding status progression
    run(
      `INSERT INTO candidate_notifications (candidate_id, title, message)
       VALUES (?, ?, ?)`,
      [
        app.candidate_id,
        `Application Status Update: ${status}`,
        `Your application ${app.application_no} status has been updated to '${status}'.`
      ]
    );

    const updated = get('SELECT * FROM applications WHERE id = ?', [id]);
    return res.json({ message: 'Application status updated.', application: updated });
  } catch (err) {
    console.error('updateApplicationStatus error:', err);
    return res.status(500).json({ error: 'Failed to update application.' });
  }
}

module.exports = {
  applyToJob,
  getCandidateApplications,
  getAllApplications,
  updateApplicationStatus
};

