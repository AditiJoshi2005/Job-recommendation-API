const { Router } = require('express');
const { getAllJobs, getJobById, createJob, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

const router = Router();
router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);
module.exports = router;