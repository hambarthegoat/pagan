# Quick Start Guide

## Get Started in 5 Steps

### 1️⃣ Setup Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env and add your PostgreSQL connection
# DATABASE_URL="postgresql://user:password@localhost:5432/pagan_db"
```

### 2️⃣ Install & Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed test data
npm run prisma:seed
```

### 3️⃣ Start Server
```bash
npm run dev
# Server runs at http://localhost:3000
```

### 4️⃣ Test APIs
```bash
# Option 1: Use test script
./test-api.sh

# Option 2: Open Prisma Studio
npm run prisma:studio

# Option 3: Manual testing with cURL (see examples below)
```

## 🔥 Quick API Examples

### Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My New Project",
    "description": "Project description here",
    "creatorId": "USER_ID_FROM_SEED",
    "memberEmails": ["john@example.com"]
  }'
```

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "projectId": "PROJECT_ID_HERE",
    "priority": "High",
    "assigneeIds": ["USER_ID_HERE"]
  }'
```

### Update Task Progress
```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}'
```

### Add Subtask
```bash
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "TASK_ID_HERE",
    "title": "Subtask title"
  }'
```

### Complete Subtask
```bash
curl -X PATCH http://localhost:3000/api/subtasks/SUBTASK_ID \
  -H "Content-Type: application/json" \
  -d '{"complete": true}'
```

### Add Comment
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "TASK_ID_HERE",
    "userId": "USER_ID_HERE",
    "content": "Great work!"
  }'
```

## 📊 Get IDs from Seeded Data

After seeding, open Prisma Studio to get actual IDs:
```bash
npm run prisma:studio
```

Or query the API:
```bash
# Get all projects (copy a project ID)
curl http://localhost:3000/api/projects | jq

# Get all tasks (copy a task ID)
curl http://localhost:3000/api/tasks | jq
```

## 🎯 All Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/[id]` | Get project |
| PUT | `/api/projects/[id]` | Update project |
| DELETE | `/api/projects/[id]` | Delete project |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/[id]` | Get task |
| PUT | `/api/tasks/[id]` | Update task |
| DELETE | `/api/tasks/[id]` | Delete task |
| POST | `/api/subtasks` | Create subtask |
| GET | `/api/subtasks?taskId=xxx` | Get subtasks |
| PUT | `/api/subtasks/[id]` | Update subtask |
| PATCH | `/api/subtasks/[id]` | Complete subtask |
| DELETE | `/api/subtasks/[id]` | Delete subtask |
| POST | `/api/comments` | Add comment |
| GET | `/api/comments?taskId=xxx` | Get comments |
| POST | `/api/files` | Upload file |
| GET | `/api/files?taskId=xxx` | Get files |

## 📚 More Documentation
- `API_GUIDE.md` - Detailed API documentation
- `FEATURES_COMPLETE.md` - Complete feature list
- `ARCHITECTURE.md` - System architecture
- `TESTING_GUIDE.md` - Testing instructions

## 🔑 Test Credentials
After seeding:
- Email: `john@example.com` | Password: `password123`
- Email: `jane@example.com` | Password: `password123`
- Email: `admin@example.com` | Password: `password123`

---

**Ready to start building! 🚀**
