# Job Recommendation API

A RESTful backend that recommends jobs based on user skill profiles using a custom scoring algorithm.

## Tech Stack
Node.js | Express.js | MongoDB | JWT

## Features
- JWT authentication with role-based access (user/admin)
- Custom scoring algorithm — 60% required skills + 25% preferred skills + 15% experience
- Personalised job recommendations ranked by match percentage
- Skill gap analysis showing most in-demand missing skills

## Setup
1. Clone the repo and run `npm install`
2. Create `.env` with your MongoDB URI and JWT secret
3. Run `npm run seed` to seed sample data
4. Run `npm run dev` to start the server at `http://localhost:5000`

## API Endpoints
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/me` | Get profile | ✅ |
| PUT | `/api/auth/update-skills` | Update skills | ✅ |
| GET | `/api/jobs` | Get all jobs | ❌ |
| POST | `/api/jobs` | Create job | ✅ Admin |
| GET | `/api/recommendations` | Get recommendations | ✅ |
| GET | `/api/recommendations/skill-gaps` | Get skill gaps | ✅ |

## Default Admin (after seeding)
Email: `admin@test.com` | Password: `admin123`
