const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: {
      type: [String],
      required: true,
      set: (s) => s.map((x) => x.toLowerCase().trim()),
    },
    preferredSkills: {
      type: [String],
      default: [],
      set: (s) => s.map((x) => x.toLowerCase().trim()),
    },
    experienceRequired: { type: Number, default: 0 },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'remote'],
      required: true,
    },
    salaryRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

JobSchema.index({ requiredSkills: 1 });
JobSchema.index({ isActive: 1 });

module.exports = mongoose.model('Job', JobSchema);