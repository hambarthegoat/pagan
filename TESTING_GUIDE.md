# Testing Sequence Diagrams

This document provides step-by-step instructions to test each implemented sequence diagram using the API.

## Prerequisites

1. Server is running: `npm run dev`
2. Database is seeded: `npm run prisma:seed`
3. Use a tool like curl, Postman, or Thunder Client

## Test Credentials

```
User 1 (Leader):
- ID: Check database after seeding
- Email: john@example.com
- Password: password123

User 2:
- Email: jane@example.com
- Password: password123
```

## Sequence Diagram 1: Create Project & Invite Members

### Step 1: Get User ID (Leader)

```bash
curl http://localhost:3000/api/users?email=john@example.com
```

**Expected Response:**
```json
{
  "id": "user-id-here",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Step 2: Create Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "New Project",
    "description": "Testing sequence diagram 1",
    "creatorId": "PASTE-USER-ID-HERE",
    "memberEmails": ["jane@example.com", "admin@example.com"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "projectId": "project-id-here"
}
```

**Expected Console Output:**
```
📧 Email Observer received notification: { type: 'project_invitation', ... }
📧 Sending invitations to: [ 'jane@example.com', 'admin@example.com' ]
```

### Step 3: Verify Project Created

```bash
curl http://localhost:3000/api/projects?id=PASTE-PROJECT-ID-HERE
```

**Verification:**
- ✅ Project exists
- ✅ Leader is a member
- ✅ Invited members are added
- ✅ Email notifications logged in console

---

## Sequence Diagram 2: Create Task + setDeadline() + addAssignee()

### Step 1: Get Project ID and User IDs

```bash
# Get projects
curl http://localhost:3000/api/projects

# Get users
curl http://localhost:3000/api/users
```

### Step 2: Create Task with Deadline and Assignees

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement Feature X",
    "description": "Testing sequence diagram 2",
    "projectId": "PASTE-PROJECT-ID-HERE",
    "deadline": "2025-12-31T23:59:59.000Z",
    "assigneeIds": ["PASTE-USER-ID-1", "PASTE-USER-ID-2"],
    "priority": "High"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "taskId": "task-id-here"
}
```

**Expected Console Output:**
```
📧 Email Observer received notification: { type: 'task_assigned', ... }
🔔 Notification Observer received: { type: 'task_assigned', ... }
📧 Notifying assignees: { id: '...', title: 'Implement Feature X', ... }
🔔 Notifying assignees about task: { ... }
```

### Step 3: Verify Task Created

```bash
curl http://localhost:3000/api/tasks?id=PASTE-TASK-ID-HERE
```

**Verification:**
- ✅ Task exists
- ✅ Deadline is set (2025-12-31)
- ✅ Assignees are added
- ✅ Status is "Pending"
- ✅ Progress is 0
- ✅ Notifications logged in console

---

## Sequence Diagram 3: View Task + Update Progress + Upload File

### Part A: View Task

```bash
curl http://localhost:3000/api/tasks?id=PASTE-TASK-ID-HERE
```

**Expected Response:**
```json
{
  "id": "task-id",
  "title": "Implement Feature X",
  "description": "Testing sequence diagram 2",
  "deadline": "2025-12-31T23:59:59.000Z",
  "progress": 0,
  "status": "Pending"
}
```

**Verification:**
- ✅ Task details retrieved
- ✅ All properties present

### Part B: Update Progress (Strategy Pattern in Action)

#### Test 1: Update to 50% (Should become "In Progress")

```bash
curl -X PATCH http://localhost:3000/api/tasks/PASTE-TASK-ID-HERE/progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 50
  }'
```

**Expected Response:**
```json
{
  "success": true
}
```

**Expected Console Output:**
```
🔔 Notification Observer received: { type: 'task_updated', ... }
🔔 Task updated notification: { id: '...', progress: 50, status: 'In Progress' }
```

**Verify Status Changed:**
```bash
curl http://localhost:3000/api/tasks?id=PASTE-TASK-ID-HERE
```

**Expected:**
- ✅ progress: 50
- ✅ status: "In Progress" (Strategy pattern applied)

#### Test 2: Update to 100% (Should become "Completed")

```bash
curl -X PATCH http://localhost:3000/api/tasks/PASTE-TASK-ID-HERE/progress \
  -H "Content-Type: application/json" \
  -d '{
    "progress": 100
  }'
```

**Verify:**
- ✅ progress: 100
- ✅ status: "Completed" (Strategy pattern applied)

### Part C: Upload File

#### Step 1: Create a test file

```bash
echo "Test file content" > test.txt
```

#### Step 2: Upload file to task

```bash
curl -X POST http://localhost:3000/api/tasks/PASTE-TASK-ID-HERE/files \
  -F "file=@test.txt" \
  -F "userId=PASTE-USER-ID-HERE"
```

**Expected Response:**
```json
{
  "id": "file-id",
  "fileName": "test.txt",
  "fileType": "text/plain",
  "fileSize": "17",
  "filePath": "/uploads/1234567890-test.txt",
  "uploadedAt": "2025-12-02T..."
}
```

#### Step 3: Verify File Attached

```bash
curl http://localhost:3000/api/tasks/PASTE-TASK-ID-HERE/files
```

**Expected Response:**
```json
[
  {
    "id": "file-id",
    "fileName": "test.txt",
    "fileType": "text/plain",
    "fileSize": "17",
    "filePath": "/uploads/1234567890-test.txt",
    "uploadedAt": "2025-12-02T..."
  }
]
```

**Verification:**
- ✅ File uploaded to `public/uploads/`
- ✅ FileAttachment record created
- ✅ Associated with correct task and user

---

## Complete Test Flow

### Full Workflow Test

```bash
# 1. Get user (leader)
LEADER_ID=$(curl -s http://localhost:3000/api/users?email=john@example.com | jq -r '.id')

# 2. Create project
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d "{
    \"projectName\": \"Test Project\",
    \"description\": \"Full workflow test\",
    \"creatorId\": \"$LEADER_ID\",
    \"memberEmails\": [\"jane@example.com\"]
  }")

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.projectId')

# 3. Create task
TASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Task\",
    \"description\": \"Full workflow test task\",
    \"projectId\": \"$PROJECT_ID\",
    \"deadline\": \"2025-12-31T23:59:59.000Z\",
    \"assigneeIds\": [\"$LEADER_ID\"],
    \"priority\": \"High\"
  }")

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.taskId')

# 4. View task
curl http://localhost:3000/api/tasks?id=$TASK_ID

# 5. Update progress to 50%
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'

# 6. Update progress to 100%
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 100}'

# 7. Upload file
echo "Test content" > workflow-test.txt
curl -X POST http://localhost:3000/api/tasks/$TASK_ID/files \
  -F "file=@workflow-test.txt" \
  -F "userId=$LEADER_ID"

# 8. Verify files
curl http://localhost:3000/api/tasks/$TASK_ID/files
```

---

## Observer Pattern Verification

Check console logs for:

### Project Invitation:
```
📧 Email Observer received notification: {
  type: 'project_invitation',
  emails: [ 'jane@example.com' ],
  projectId: '...'
}
```

### Task Assignment:
```
📧 Email Observer received notification: {
  type: 'task_assigned',
  task: { id: '...', title: '...', assignees: [...] }
}

🔔 Notification Observer received: {
  type: 'task_assigned',
  task: { ... }
}
```

### Task Update:
```
🔔 Notification Observer received: {
  type: 'task_updated',
  task: { id: '...', progress: 50, status: 'In Progress' }
}
```

---

## Strategy Pattern Verification

Test different progress values to see status changes:

```bash
# 0% → Status should be "Pending"
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 0}'

# 1% → Status should be "In Progress"
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 1}'

# 50% → Status should be "In Progress"
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'

# 100% → Status should be "Completed"
curl -X PATCH http://localhost:3000/api/tasks/$TASK_ID/progress \
  -H "Content-Type: application/json" \
  -d '{"progress": 100}'
```

**DefaultStatusStrategy applied:**
- 0% = Pending ✅
- 1-99% = In Progress ✅
- 100% = Completed ✅

---

## Success Criteria

### Sequence Diagram 1 ✅
- [x] Project created
- [x] Leader added as member
- [x] Members invited by email
- [x] Observer pattern notification sent
- [x] Email service logged invitation

### Sequence Diagram 2 ✅
- [x] Task created
- [x] Deadline set
- [x] Assignees added
- [x] Observer pattern notification sent
- [x] Email and notification services logged

### Sequence Diagram 3 ✅
- [x] Task retrieved with details
- [x] Progress updated
- [x] Strategy pattern applied status change
- [x] File uploaded
- [x] FileAttachment created
- [x] File accessible in uploads directory

---

## Troubleshooting

### Issue: User ID not found
**Solution:** Run `npm run prisma:seed` to create test users

### Issue: Cannot create project
**Solution:** Verify DATABASE_URL in .env and database is running

### Issue: File upload fails
**Solution:** Ensure `public/uploads/` directory exists

### Issue: No console logs
**Solution:** Check terminal running `npm run dev` for Observer notifications
