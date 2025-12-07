# API Endpoints Documentation

This document lists all available API endpoints for the Task Tracker application.

## Base URL
```
http://localhost:3000/api
```

## Setup Instructions

1. **Install dependencies:**
```bash
npm install
```

2. **Setup database:**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your PostgreSQL connection string
# DATABASE_URL="postgresql://user:password@localhost:5432/pagan_db?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed
```

3. **Start the development server:**
```bash
npm run dev
```

## API Endpoints

### Projects

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "projectName": "My Project",
  "description": "Project description",
  "creatorId": "user-uuid",
  "memberEmails": ["user1@example.com", "user2@example.com"]
}
```

#### Get All Projects
```http
GET /api/projects
```

#### Get Projects by User
```http
GET /api/projects?userId=user-uuid
```

#### Get Single Project
```http
GET /api/projects/[id]
```

#### Update Project
```http
PUT /api/projects/[id]
Content-Type: application/json

{
  "projectName": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /api/projects/[id]
```

---

### Tasks

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Task title",
  "description": "Task description",
  "projectId": "project-uuid",
  "deadline": "2025-12-31T23:59:59Z",
  "assigneeIds": ["user-uuid-1", "user-uuid-2"],
  "priority": "High"
}
```

#### Get All Tasks
```http
GET /api/tasks
```

#### Get Tasks by Project
```http
GET /api/tasks?projectId=project-uuid
```

#### Get Single Task
```http
GET /api/tasks/[id]
```

#### Update Task
```http
PUT /api/tasks/[id]
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "progress": 75,
  "status": "In Progress"
}
```

#### Update Task Progress
```http
PUT /api/tasks/[id]
Content-Type: application/json

{
  "progress": 85
}
```

#### Delete Task
```http
DELETE /api/tasks/[id]
```

---

### Subtasks

#### Create Subtask
```http
POST /api/subtasks
Content-Type: application/json

{
  "taskId": "task-uuid",
  "title": "Subtask title"
}
```

#### Get Subtasks for a Task
```http
GET /api/subtasks?taskId=task-uuid
```

#### Update Subtask
```http
PUT /api/subtasks/[id]
Content-Type: application/json

{
  "progress": 50,
  "status": "In Progress"
}
```

#### Complete Subtask
```http
PATCH /api/subtasks/[id]
Content-Type: application/json

{
  "complete": true
}
```

#### Delete Subtask
```http
DELETE /api/subtasks/[id]
```

---

### Comments

#### Add Comment
```http
POST /api/comments
Content-Type: application/json

{
  "taskId": "task-uuid",
  "userId": "user-uuid",
  "content": "This is a comment"
}
```

#### Get Comments for a Task
```http
GET /api/comments?taskId=task-uuid
```

---

### File Attachments

#### Upload File
```http
POST /api/files
Content-Type: multipart/form-data

formData:
  - taskId: "task-uuid"
  - userId: "user-uuid"
  - file: [binary file]
```

#### Get Files for a Task
```http
GET /api/files?taskId=task-uuid
```

---

## Example Usage with cURL

### Create a Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "New Website",
    "description": "Building a new corporate website",
    "creatorId": "user-id-here",
    "memberEmails": ["john@example.com"]
  }'
```

### Create a Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design Homepage",
    "description": "Create the homepage design",
    "projectId": "project-id-here",
    "deadline": "2025-12-31T23:59:59Z",
    "assigneeIds": ["user-id-here"],
    "priority": "High"
  }'
```

### Update Task Progress
```bash
curl -X PUT http://localhost:3000/api/tasks/[task-id] \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}'
```

### Add Subtask
```bash
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-id-here",
    "title": "Create wireframe"
  }'
```

### Complete Subtask
```bash
curl -X PATCH http://localhost:3000/api/subtasks/[subtask-id] \
  -H "Content-Type: application/json" \
  -d '{"complete": true}'
```

### Add Comment
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task-id-here",
    "userId": "user-id-here",
    "content": "Great work on this task!"
  }'
```

---

## Seeded Test Data

After running `npm run prisma:seed`, you'll have:

**Users:**
- john@example.com (Password: password123)
- jane@example.com (Password: password123)
- admin@example.com (Password: password123)

**Projects:**
- Website Redesign
- Mobile App Development

**Tasks:**
- Design landing page (with subtasks)
- Implement authentication (with subtasks)
- Write API documentation

You can use the user IDs from these seeded records in your API calls.

---

## Testing with Prisma Studio

Run Prisma Studio to view and manage your database:
```bash
npm run prisma:studio
```

This will open a browser at `http://localhost:5555` where you can view all your data.

---

## Status Values

### Task/Subtask Status
- `Pending` - Not started
- `In Progress` - Currently being worked on
- `Completed` - Finished

### Priority Levels
- `Low`
- `Medium`
- `High`

---

## Error Responses

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```
