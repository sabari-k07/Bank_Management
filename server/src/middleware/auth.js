const jwt = require('jsonwebtoken');
const { get } = require('../config/db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token missing or invalid.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_bank_recruitment_jwt_key_2026', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or token invalid.' });
    }
    
    // Attach user record from db
    const dbUser = get('SELECT id, email, role FROM users WHERE id = ?', [user.id]);
    if (!dbUser) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = dbUser;
    next();
  });
}

function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Role '${req.user.role}' lacks necessary permissions.` });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};

