const { get, run, all } = require('../config/db');

function getAdmitCardByApplication(req, res) {
  try {
    const { applicationId } = req.params;

    // Verify ownership if candidate
    const app = get('SELECT * FROM applications WHERE id = ?', [applicationId]);
    if (!app) {
      return res.status(404).json({ error: 'Application record not found.' });
    }

    if (req.user.role === 'CANDIDATE') {
      const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
      if (app.candidate_id !== profile.id) {
        return res.status(403).json({ error: 'Unauthorized access to this admit card.' });
      }
    }

    const admitCard = get(
      `SELECT 
        ac.*,
        a.application_no,
        j.title as job_title,
        j.job_code,
        e.exam_name,
        e.exam_date,
        e.exam_time,
        e.duration_minutes,
        cp.full_name as candidate_name,
        cp.date_of_birth,
        cp.gender,
        cp.category,
        cp.photo_url
       FROM admit_cards ac
       JOIN applications a ON ac.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       JOIN exams e ON ac.exam_id = e.id
       JOIN candidate_profiles cp ON a.candidate_id = cp.id
       WHERE ac.application_id = ?`,
      [applicationId]
    );

    if (!admitCard) {
      return res.status(404).json({ error: 'Admit card has not been issued yet for this application.' });
    }

    return res.json({ admitCard });
  } catch (err) {
    console.error('getAdmitCard error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admit card.' });
  }
}

function issueAdmitCard(req, res) {
  try {
    const { applicationId, examId, examCenter, reportingTime, instructions } = req.body;

    if (!applicationId || !examId || !examCenter || !reportingTime) {
      return res.status(400).json({ error: 'Application, Exam, Center, and Reporting time are required.' });
    }

    const app = get('SELECT * FROM applications WHERE id = ?', [applicationId]);
    if (!app) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    const rollNumber = `ROLL-APEX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    run(
      `INSERT INTO admit_cards (application_id, exam_id, roll_number, exam_center, reporting_time, instructions)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(application_id) DO UPDATE SET
        exam_id = excluded.exam_id,
        exam_center = excluded.exam_center,
        reporting_time = excluded.reporting_time,
        instructions = excluded.instructions`,
      [
        applicationId,
        examId,
        rollNumber,
        examCenter,
        reportingTime,
        instructions || 'Carry photo ID proof and 2 passport photos.'
      ]
    );

    // Update application status
    run("UPDATE applications SET status = 'Admit Card Issued' WHERE id = ?", [applicationId]);

    // In-app notification
    run(
      `INSERT INTO candidate_notifications (candidate_id, title, message)
       VALUES (?, ?, ?)`,
      [
        app.candidate_id,
        'Admit Card Issued',
        `Your admit card has been issued with Roll No. ${rollNumber}. Download it from your portal.`
      ]
    );

    return res.status(201).json({ message: 'Admit card issued successfully.', rollNumber });
  } catch (err) {
    console.error('issueAdmitCard error:', err);
    return res.status(500).json({ error: 'Failed to issue admit card.' });
  }
}

module.exports = {
  getAdmitCardByApplication,
  issueAdmitCard
};

