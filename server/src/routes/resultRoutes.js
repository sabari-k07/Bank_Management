const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/my-results', authenticateToken, requireRole(['CANDIDATE']), resultController.getCandidateResults);
router.post('/publish', authenticateToken, requireRole(['ADMIN', 'HR_OFFICER']), resultController.publishResult);

module.exports = router;

