const { get, all, run } = require('../config/db');

function publishResult(req, res) {
  try {
    const { applicationId, examId, marksObtained, rank, isQualified, remarks } = req.body;

    if (!applicationId || !examId || marksObtained === undefined) {
      return res.status(400).json({ error: 'Application ID, Exam ID, and Marks are required.' });
    }

    const app = get('SELECT candidate_id FROM applications WHERE id = ?', [applicationId]);
    if (!app) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    run(
      `INSERT INTO results (application_id, exam_id, marks_obtained, rank, is_qualified, remarks)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(application_id, exam_id) DO UPDATE SET
        marks_obtained = excluded.marks_obtained,
        rank = excluded.rank,
        is_qualified = excluded.is_qualified,
        remarks = excluded.remarks,
        published_at = CURRENT_TIMESTAMP`,
      [applicationId, examId, marksObtained, rank || null, isQualified ? 1 : 0, remarks || '']
    );

    // Update application status
    const newStatus = isQualified ? 'Selected' : 'Rejected';
    run('UPDATE applications SET status = ? WHERE id = ?', [newStatus, applicationId]);

    // Send candidate notification
    run(
      `INSERT INTO candidate_notifications (candidate_id, title, message)
       VALUES (?, ?, ?)`,
      [
        app.candidate_id,
        'Examination Result Declared',
        `Your result has been published. Status: ${isQualified ? 'Qualified' : 'Not Qualified'}. Check score sheet.`
      ]
    );

    return res.status(200).json({ message: 'Result recorded and published successfully.' });
  } catch (err) {
    console.error('publishResult error:', err);
    return res.status(500).json({ error: 'Failed to record examination result.' });
  }
}

function getCandidateResults(req, res) {
  try {
    const profile = get('SELECT id FROM candidate_profiles WHERE user_id = ?', [req.user.id]);
    if (!profile) {
      return res.json({ results: [] });
    }

    const results = all(
      `SELECT 
        r.*,
        a.application_no,
        j.title as job_title,
        j.job_code,
        e.exam_name,
        e.total_marks,
        e.passing_marks
       FROM results r
       JOIN applications a ON r.application_id = a.id
       JOIN jobs j ON a.job_id = j.id
       JOIN exams e ON r.exam_id = e.id
       WHERE a.candidate_id = ?
       ORDER BY r.published_at DESC`,
      [profile.id]
    );

    return res.json({ results });
  } catch (err) {
    console.error('getCandidateResults error:', err);
    return res.status(500).json({ error: 'Failed to retrieve candidate results.' });
  }
}

module.exports = {
  publishResult,
  getCandidateResults
};

