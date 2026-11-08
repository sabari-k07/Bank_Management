const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Public listing
router.get('/', jobController.listJobs);
router.get('/:id', jobController.getJobById);

// Admin / HR Management
router.post('/', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), jobController.createJob);
router.put('/:id', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), jobController.updateJob);

module.exports = router;

