# 🚀 Growth Orbit — Backend API

> AI Roadmap Generator + Smart Resume Builder — Production-ready Node.js/Express/MongoDB backend.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Setup Instructions](#setup-instructions)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Key Workflows](#key-workflows)
- [Security](#security)
- [Environment Variables](#environment-variables)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (Access + Refresh tokens) |
| Password | bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, rate-limit, mongo-sanitize, HPP |
| Logging | Winston |
| File Upload | Multer |

---

## 📁 Project Structure

```
growth-orbit-backend/
│
├── src/
│   ├── config/
│   │   └── app.config.js          # Centralized env config
│   │
│   ├── constants/
│   │   └── index.js               # HTTP codes, XP values, enums
│   │
│   ├── controllers/               # Request handlers (thin layer)
│   │   ├── auth.controller.js
│   │   ├── profile.controller.js
│   │   ├── resume.controller.js
│   │   ├── roadmap.controller.js
│   │   ├── skill.controller.js
│   │   ├── task.controller.js
│   │   ├── certificate.controller.js
│   │   ├── gamification.controller.js
│   │   ├── progress.controller.js
│   │   ├── dashboard.controller.js
│   │   └── admin.controller.js
│   │
│   ├── database/
│   │   ├── connection.js          # MongoDB connection + events
│   │   └── seeder.js              # Seed skills + admin user
│   │
│   ├── helpers/
│   │   ├── pagination.helper.js   # Page/limit/skip builder
│   │   ├── xp.helper.js           # Level calculator
│   │   ├── query.helper.js        # Mongo query utilities
│   │   └── file.helper.js         # File system utilities
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT protect + restrictTo
│   │   ├── errorHandler.js        # Global error handler
│   │   ├── notFound.js            # 404 handler
│   │   ├── rateLimiter.js         # General + auth rate limits
│   │   ├── upload.middleware.js   # Multer file upload
│   │   └── validate.middleware.js # express-validator runner
│   │
│   ├── models/                    # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Profile.model.js
│   │   ├── Resume.model.js
│   │   ├── Roadmap.model.js
│   │   ├── Skill.model.js         # SkillCatalog + UserSkill
│   │   ├── Task.model.js          # Question + Task + TestSubmission
│   │   ├── Certificate.model.js
│   │   ├── Gamification.model.js
│   │   ├── Progress.model.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── profile.routes.js
│   │   ├── resume.routes.js
│   │   ├── roadmap.routes.js
│   │   ├── skill.routes.js
│   │   ├── task.routes.js
│   │   ├── certificate.routes.js
│   │   ├── gamification.routes.js
│   │   ├── progress.routes.js
│   │   ├── dashboard.routes.js
│   │   └── admin.routes.js
│   │
│   ├── services/                  # Business logic layer
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── resume.service.js
│   │   ├── roadmap.service.js
│   │   ├── skill.service.js
│   │   ├── test.service.js        # Score calc, pass/fail, unlock
│   │   ├── certificate.service.js
│   │   ├── gamification.service.js
│   │   ├── progress.service.js
│   │   ├── dashboard.service.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── AppError.js            # Custom error class
│   │   ├── asyncHandler.js        # Try/catch wrapper
│   │   ├── helpers.js             # String/date utilities
│   │   ├── jwt.helper.js          # Token sign/verify
│   │   ├── logger.js              # Winston logger
│   │   └── response.js            # Standardized responses
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── certificate.validator.js
│   │   ├── profile.validator.js
│   │   ├── question.validator.js
│   │   ├── resume.validator.js
│   │   ├── roadmap.validator.js
│   │   ├── skill.validator.js
│   │   └── task.validator.js
│   │
│   └── app.js                     # Express app (middleware + routes)
│
├── uploads/                       # Uploaded certificate files
├── logs/                          # Application logs
│
├── server.js                      # Entry point
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🗄 Database Design

### Collections & Relationships

```
Users ──────────────────────── (1:1) ──── Profiles
  │                                            │
  ├── (1:1) ──── Gamification                  └── Resume (ref)
  │
  ├── (1:1) ──── Progress
  │
  ├── (1:N) ──── Resumes
  │
  ├── (1:N) ──── Roadmaps ──── (1:N) ──── Tasks ──── (1:1) ──── SkillCatalog
  │
  ├── (1:N) ──── UserSkills ── (N:1) ──── SkillCatalog
  │
  ├── (1:N) ──── Certificates ─ (N:1) ─── SkillCatalog
  │
  └── (1:N) ──── TestSubmissions ── (N:1) ── SkillCatalog / Tasks


SkillCatalog ── (1:N) ──── Questions (MCQ bank)
```

### Key Indexes

| Collection | Index |
|---|---|
| users | email (unique), createdAt |
| profiles | user (unique) |
| resumes | user, isActive |
| roadmaps | user + status, user + createdAt |
| tasks | user + status, user + roadmap |
| userSkills | user + skill (unique) |
| certificates | user + skill, verificationStatus |
| gamification | totalXP (leaderboard) |
| questions | skill + difficulty, skill + isActive |
| testSubmissions | user + skill, user + passed |

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm 9+

### 1. Clone & Install

```bash
git clone <repo-url>
cd growth-orbit-backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Create Upload Directory

```bash
mkdir -p uploads logs
```

### 4. Seed the Database

```bash
# Seed skills catalog + admin user
node src/database/seeder.js

# To wipe all data (DANGER)
node src/database/seeder.js --destroy
```

**Default Admin Credentials (after seeding):**
- Email: `admin@growthorbit.com`
- Password: `Admin@1234!`
- ⚠️ Change these immediately in production.

### 5. Start the Server

```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

### 6. Verify

```
GET http://localhost:5000/health
```

---

## 🔌 API Reference

All endpoints are prefixed with `/api/v1`.

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register new account |
| POST | `/login` | ❌ | Login + receive tokens |
| GET | `/me` | ✅ | Get current user |
| PATCH | `/change-password` | ✅ | Change password |
| DELETE | `/deactivate` | ✅ | Deactivate account |

### Profile — `/api/v1/profile`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get my profile |
| PATCH | `/` | ✅ | Update profile |
| GET | `/completion` | ✅ | Get completion % |

### Resume — `/api/v1/resume`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create resume |
| GET | `/` | ✅ | Get active resume |
| PATCH | `/` | ✅ | Update active resume |
| GET | `/history` | ✅ | Get all resume versions |
| GET | `/:id` | ✅ | Get resume by ID |
| DELETE | `/:id` | ✅ | Delete inactive resume |

### Roadmap — `/api/v1/roadmap`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ✅ | Create roadmap |
| GET | `/` | ✅ | List my roadmaps |
| GET | `/:id` | ✅ | Get roadmap |
| PATCH | `/:id` | ✅ | Update roadmap |
| PATCH | `/:id/complete-phase` | ✅ | Mark phase complete |
| DELETE | `/:id` | ✅ | Delete roadmap |

### Skills — `/api/v1/skills`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/catalog` | ✅ | Browse skill catalog |
| GET | `/catalog/:id` | ✅ | Get skill detail |
| POST | `/catalog` | 🔑 Admin | Add skill to catalog |
| GET | `/my` | ✅ | My skill list |
| POST | `/my` | ✅ | Add skill to my list |
| PATCH | `/my/:id` | ✅ | Update skill status |
| DELETE | `/my/:id` | ✅ | Remove skill |

### Tasks & Tests — `/api/v1/tasks`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | List my tasks |
| POST | `/` | ✅ | Create task |
| GET | `/:id` | ✅ | Get task |
| PATCH | `/:id/status` | ✅ | Update task status |
| GET | `/:id/test/questions` | ✅ | Get test questions (locked until cert verified) |
| POST | `/:id/test/submit` | ✅ | Submit test answers |
| DELETE | `/:id` | ✅ | Delete task |

### Certificates — `/api/v1/certificates`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/upload` | ✅ | Upload certificate (multipart/form-data) |
| GET | `/my` | ✅ | List my certificates |
| GET | `/my/:id` | ✅ | Get certificate |
| DELETE | `/my/:id` | ✅ | Delete certificate |
| PATCH | `/:id/verify` | 🔑 Admin | Verify / reject certificate |

### Gamification — `/api/v1/gamification`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/me` | ✅ | My XP, level, badges, stats |
| GET | `/leaderboard` | ✅ | Top users by XP |

### Progress — `/api/v1/progress`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get progress summary |
| POST | `/recalculate` | ✅ | Force recalculate progress |

### Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Full dashboard summary |
| GET | `/activity` | ✅ | Activity timeline |

### Admin — `/api/v1/admin`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users` | 🔑 Admin | List all users |
| GET | `/users/:id` | 🔑 Admin | Get user by ID |
| PATCH | `/users/:id/toggle-status` | 🔑 Admin | Activate / deactivate user |
| GET | `/certificates/pending` | 🔑 Admin | Pending cert review queue |
| PATCH | `/certificates/:id/verify` | 🔑 Admin | Verify / reject certificate |
| GET | `/questions` | 🔑 Admin | List questions |
| POST | `/questions` | 🔑 Admin | Add single question |
| POST | `/questions/bulk` | 🔑 Admin | Bulk add questions |
| PATCH | `/questions/:id` | 🔑 Admin | Update question |
| DELETE | `/questions/:id` | 🔑 Admin | Delete question |
| PATCH | `/skills/:id` | 🔑 Admin | Update skill |
| DELETE | `/skills/:id` | 🔑 Admin | Deactivate skill |

---

## 🔐 Authentication Flow

```
1. POST /api/v1/auth/signup
   → Validates input → Hashes password (bcrypt, 12 rounds)
   → Creates User + Profile + Gamification + Progress
   → Returns: { user, accessToken, refreshToken }

2. POST /api/v1/auth/login
   → Verifies email + password
   → Returns: { user, accessToken, refreshToken }

3. Protected Routes
   → Include header: Authorization: Bearer <accessToken>
   → Middleware verifies JWT → attaches req.user
```

---

## 🔄 Key Workflows

### Certificate → Test → Resume Auto-Update

```
User uploads certificate (POST /certificates/upload)
  ↓ Status: PENDING
  
Admin verifies it (PATCH /admin/certificates/:id/verify)
  ↓ Status: VERIFIED
  ↓ testUnlocked = true on UserSkill
  ↓ Task status: LOCKED → AVAILABLE

User fetches questions (GET /tasks/:id/test/questions)
  ↓ 100 random MCQ questions (correct answers hidden)

User submits answers (POST /tasks/:id/test/submit)
  ↓ Score calculated server-side
  ↓ score >= 85: PASSED
    ↓ Task marked COMPLETED
    ↓ Skill added to Resume automatically
    ↓ XP awarded (200 pts)
    ↓ Progress recalculated
    ↓ Level updated
  ↓ score < 85: FAILED (can retry)
```

### XP & Leveling

```
Actions that earn XP:
  TASK_COMPLETION      →  50 XP
  TEST_PASS            → 200 XP
  CERTIFICATE_UPLOAD   → 100 XP
  MILESTONE_REACHED    → 500 XP
  RESUME_UPDATED       →  30 XP
  PROFILE_COMPLETED    →  75 XP
  ROADMAP_CREATED      → 100 XP

Levels:
  1 Rookie       (0 XP)
  2 Explorer     (200 XP)
  3 Learner      (500 XP)
  4 Builder      (1000 XP)
  5 Developer    (2000 XP)
  6 Engineer     (3500 XP)
  7 Expert       (5500 XP)
  8 Master       (8000 XP)
  9 Champion     (11000 XP)
  10 Legend      (15000 XP)
```

### Progress Formula

```
Overall Progress = Tasks(40%) + Skills(30%) + Roadmap(20%) + Tests(10%)

Each sub-score = (completed / total) * 100
```

---

## 🛡 Security

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs, 12 salt rounds |
| JWT tokens | Access (7d) + Refresh (30d) |
| Rate limiting | 100 req/15min general, 20 req/15min auth |
| NoSQL injection | express-mongo-sanitize |
| XSS prevention | Helmet headers |
| HTTP param pollution | hpp middleware |
| CORS | Whitelist-based origin control |
| File upload safety | MIME type + size validation |
| Admin protection | Role-based middleware on all admin routes |

---

## 🌱 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | No | development / production |
| `PORT` | No | Server port (default 5000) |
| `MONGO_URI` | Yes | MongoDB connection string |
| `MONGO_URI_PROD` | In prod | Production MongoDB URI |
| `JWT_SECRET` | Yes | Access token secret (32+ chars) |
| `JWT_EXPIRES_IN` | No | Access token expiry (default 7d) |
| `JWT_REFRESH_SECRET` | Yes | Refresh token secret |
| `JWT_REFRESH_EXPIRES_IN` | No | Refresh expiry (default 30d) |
| `BCRYPT_SALT_ROUNDS` | No | bcrypt rounds (default 12) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default 100) |
| `MAX_FILE_SIZE` | No | Max upload size in bytes (default 5MB) |
| `UPLOAD_PATH` | No | File upload directory |
| `ALLOWED_ORIGINS` | No | Comma-separated allowed CORS origins |
| `LOG_LEVEL` | No | Winston log level (default info) |

---

## 📝 Standard Response Format

```json
// Success
{
  "status": "success",
  "message": "Resource fetched.",
  "data": { ... }
}

// Paginated
{
  "status": "success",
  "message": "Items fetched.",
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}

// Error
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```
