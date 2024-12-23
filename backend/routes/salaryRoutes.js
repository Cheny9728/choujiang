const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const auth = require('../middleware/auth');

router.get('/query', auth, salaryController.getSalary);
router.get('/stats', auth, salaryController.getSalaryStats);
router.post('/add', auth, salaryController.addSalary);
router.put('/update', auth, salaryController.updateSalary);

module.exports = router; 