const { all, get, run } = require('../config/db');

function listJobs(req, res) {
  try {
    const { search, department, status } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    // For public candidate views, default to OPEN status only
    if (status && status !== 'ALL') {
      query += ' AND status = ?';
      params.push(status);
    } else if (!status) {
      query += ' AND status = "OPEN"';
    }

    if (search) {
      query += ' AND (title LIKE ? OR job_code LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    query += ' ORDER BY created_at DESC';

    const jobs = all(query, params);
    return res.json({ jobs });
  } catch (err) {
    console.error('listJobs error:', err);
    return res.status(500).json({ error: 'Failed to fetch job openings.' });
  }
}

function getJobById(req, res) {
  try {
    const { id } = req.params;
    const job = get('SELECT * FROM jobs WHERE id = ?', [id]);
    if (!job) {
      return res.status(404).json({ error: 'Job opening not found.' });
    }

    const exam = get('SELECT * FROM exams WHERE job_id = ?', [id]);
    return res.json({ job: { ...job, exam } });
  } catch (err) {
    console.error('getJobById error:', err);
    return res.status(500).json({ error: 'Failed to fetch job details.' });
  }
}

function createJob(req, res) {
  try {
    const {
      job_code,
      title,
      department,
      vacancies,
      min_qualification,
      min_age,
      max_age,
      salary_grade,
      start_date,
      end_date,
      description
    } = req.body;

    if (!job_code || !title || !department || !min_qualification || !start_date || !end_date) {
      return res.status(400).json({ error: 'All core job notification details are mandatory.' });
    }

    const existing = get('SELECT id FROM jobs WHERE job_code = ?', [job_code]);
    if (existing) {
      return res.status(409).json({ error: 'A job posting with this code already exists.' });
    }

    const result = run(
      `INSERT INTO jobs 
       (job_code, title, department, vacancies, min_qualification, min_age, max_age, salary_grade, start_date, end_date, description, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        job_code,
        title,
        department,
        vacancies || 1,
        min_qualification,
        min_age || 20,
        max_age || 30,
        salary_grade || 'Grade I',
        start_date,
        end_date,
        description || '',
        req.user.id
      ]
    );

    const created = get('SELECT * FROM jobs WHERE id = ?', [result.lastInsertRowid]);
    return res.status(201).json({ message: 'Job opening published successfully.', job: created });
  } catch (err) {
    console.error('createJob error:', err);
    return res.status(500).json({ error: 'Failed to create job posting.' });
  }
}

function updateJob(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      department,
      vacancies,
      min_qualification,
      min_age,
      max_age,
      salary_grade,
      start_date,
      end_date,
      status,
      description
    } = req.body;

    const existing = get('SELECT id FROM jobs WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Job opening not found.' });
    }

    run(
      `UPDATE jobs SET
        title = COALESCE(?, title),
        department = COALESCE(?, department),
        vacancies = COALESCE(?, vacancies),
        min_qualification = COALESCE(?, min_qualification),
        min_age = COALESCE(?, min_age),
        max_age = COALESCE(?, max_age),
        salary_grade = COALESCE(?, salary_grade),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        status = COALESCE(?, status),
        description = COALESCE(?, description)
       WHERE id = ?`,
      [
        title,
        department,
        vacancies,
        min_qualification,
        min_age,
        max_age,
        salary_grade,
        start_date,
        end_date,
        status,
        description,
        id
      ]
    );

    const updated = get('SELECT * FROM jobs WHERE id = ?', [id]);
    return res.json({ message: 'Job posting updated successfully.', job: updated });
  } catch (err) {
    console.error('updateJob error:', err);
    return res.status(500).json({ error: 'Failed to update job posting.' });
  }
}

module.exports = {
  listJobs,
  getJobById,
  createJob,
  updateJob
};

