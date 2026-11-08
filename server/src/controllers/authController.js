const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run, db } = require('../config/db');

async function register(req, res) {
  try {
    const { email, password, full_name, date_of_birth, gender, phone, category, address } = req.body;

    if (!email || !password || !full_name || !date_of_birth || !gender || !phone || !address) {
      return res.status(400).json({ error: 'All essential personal and contact fields are required.' });
    }

    const existing = get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction for atomic user + candidate_profile creation
    db.exec('BEGIN TRANSACTION;');
    try {
      const userResult = run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email.trim().toLowerCase(), hashedPassword, 'CANDIDATE']
      );
      const userId = userResult.lastInsertRowid;

      run(
        `INSERT INTO candidate_profiles (user_id, full_name, date_of_birth, gender, phone, category, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, full_name, date_of_birth, gender, phone, category || 'GENERAL', address]
      );

      db.exec('COMMIT;');

      const token = jwt.sign(
        { id: userId, email: email.trim().toLowerCase(), role: 'CANDIDATE' },
        process.env.JWT_SECRET || 'super_secret_bank_recruitment_jwt_key_2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.status(201).json({
        message: 'Candidate registration completed successfully.',
        token,
        user: {
          id: userId,
          email: email.trim().toLowerCase(),
          role: 'CANDIDATE',
          full_name
        }
      });
    } catch (err) {
      db.exec('ROLLBACK;');
      throw err;
    }
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let profile = null;
    if (user.role === 'CANDIDATE') {
      profile = get('SELECT * FROM candidate_profiles WHERE user_id = ?', [user.id]);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'super_secret_bank_recruitment_jwt_key_2026',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

function getMe(req, res) {
  try {
    const user = req.user;
    let profile = null;
    let qualifications = [];

    if (user.role === 'CANDIDATE') {
      profile = get('SELECT * FROM candidate_profiles WHERE user_id = ?', [user.id]);
      if (profile) {
        qualifications = require('../config/db').all(
          'SELECT * FROM educational_qualifications WHERE candidate_id = ? ORDER BY passing_year ASC',
          [profile.id]
        );
      }
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile,
        qualifications
      }
    });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
}

module.exports = {
  register,
  login,
  getMe
};

