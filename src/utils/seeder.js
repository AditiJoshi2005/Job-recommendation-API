require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');

const jobs = [
  {
    title: 'Full Stack Developer',
    company: 'TechCorp',
    description: 'Build scalable web apps.',
    requiredSkills: ['javascript', 'react', 'node.js', 'mongodb'],
    preferredSkills: ['typescript', 'docker'],
    experienceRequired: 2,
    location: 'Remote',
    jobType: 'remote',
    salaryRange: { min: 60000, max: 100000, currency: 'USD' }
  },
  {
    title: 'Backend Engineer',
    company: 'DataSoft',
    description: 'Design REST APIs.',
    requiredSkills: ['node.js', 'mongodb', 'express'],
    preferredSkills: ['redis'],
    experienceRequired: 1,
    location: 'Bangalore',
    jobType: 'full-time',
    salaryRange: { min: 50000, max: 80000, currency: 'USD' }
  },
  {
    title: 'Frontend Developer',
    company: 'PixelUI',
    description: 'Build modern UIs.',
    requiredSkills: ['react', 'javascript', 'css'],
    preferredSkills: ['tailwind'],
    experienceRequired: 1,
    location: 'Hyderabad',
    jobType: 'full-time',
    salaryRange: { min: 40000, max: 70000, currency: 'USD' }
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudOps',
    description: 'Manage CI/CD pipelines.',
    requiredSkills: ['docker', 'kubernetes', 'linux'],
    preferredSkills: ['aws'],
    experienceRequired: 3,
    location: 'Remote',
    jobType: 'remote',
    salaryRange: { min: 80000, max: 120000, currency: 'USD' }
  },
  {
    title: 'MERN Developer',
    company: 'StartupX',
    description: 'End-to-end MERN development.',
    requiredSkills: ['mongodb', 'express', 'react', 'node.js'],
    preferredSkills: ['redux'],
    experienceRequired: 2,
    location: 'Chennai',
    jobType: 'full-time',
    salaryRange: { min: 55000, max: 90000, currency: 'USD' }
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log('✅ 5 jobs seeded.');

  await User.deleteMany({ email: 'admin@test.com' });
  await User.create({
    name: 'Admin',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    skills: ['javascript', 'react', 'node.js'],
    experience: 5
  });
  console.log('✅ Admin seeded — Email: admin@test.com | Password: admin123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });