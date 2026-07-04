const Job = require('../models/Job');

const getAllJobs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = { isActive: true };
    if (req.query.jobType) filter.jobType = req.query.jobType;
    if (req.query.skill) filter.requiredSkills = { $in: [req.query.skill.toLowerCase()] };

    const [jobs, total] = await Promise.all([
      Job.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
      Job.countDocuments(filter),
    ]);
    res.status(200).json({ success: true, message: `${jobs.length} jobs found.`, data: { jobs, pagination: { total, page, limit, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.status(200).json({ success: true, message: 'Job retrieved.', data: { job } });
  } catch (error) { next(error); }
};

const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, message: 'Job created.', data: { job } });
  } catch (error) { next(error); }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.status(200).json({ success: true, message: 'Job updated.', data: { job } });
  } catch (error) { next(error); }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!job) return res.status(404).json({ success: false, message: 'Job not found.' });
    res.status(200).json({ success: true, message: 'Job deactivated.' });
  } catch (error) { next(error); }
};

module.exports = { getAllJobs, getJobById, createJob, updateJob, deleteJob };