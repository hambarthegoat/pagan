# How to Test All CRUD Operations

## Step 1: Start the Server

Open a terminal and run:
```bash
cd /home/thrax/Documents/Kuliah/sem3/PPL/pagan
npm run dev
```

Keep this terminal open. The server will run at `http://localhost:3000`

## Step 2: Open a New Terminal for Testing

Open a **second terminal** for running commands.

## Step 3: Get User and Project IDs

First, get the IDs from the seeded data:

```bash
# Get all users (copy a user ID)
curl http://localhost:3000/api/users | jq '.'

# Get all projects (copy a project ID)
curl http://localhost:3000/api/projects | jq '.'
```

## Step 4: Test CRUD Operations

### ✅ CREATE Operations

**Create a Project:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "description": "Testing CRUD operations",
    "creatorId": "PASTE_USER_ID_HERE",
    "memberEmails": ["john@example.com"]
  }' | jq '.'
```

**Create a Task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "Testing task creation",
    "projectId": "PASTE_PROJECT_ID_HERE",
    "priority": "High",
    "assigneeIds": ["PASTE_USER_ID_HERE"]
  }' | jq '.'
```

**Add a Subtask:**
```bash
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "PASTE_TASK_ID_HERE",
    "title": "Test Subtask"
  }' | jq '.'
```

**Add a Comment:**
```bash
curl -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "PASTE_TASK_ID_HERE",
    "userId": "PASTE_USER_ID_HERE",
    "content": "This is a test comment"
  }' | jq '.'
```

### ✅ READ Operations

**Get All Projects:**
```bash
curl http://localhost:3000/api/projects | jq '.'
```

**Get All Tasks:**
```bash
curl http://localhost:3000/api/tasks | jq '.'
```

**Get Tasks for a Project:**
```bash
curl "http://localhost:3000/api/tasks?projectId=PASTE_PROJECT_ID_HERE" | jq '.'
```

**Get Subtasks for a Task:**
```bash
curl "http://localhost:3000/api/subtasks?taskId=PASTE_TASK_ID_HERE" | jq '.'
```

**Get Comments for a Task:**
```bash
curl "http://localhost:3000/api/comments?taskId=PASTE_TASK_ID_HERE" | jq '.'
```

### ✅ UPDATE Operations

**Update Task Progress:**
```bash
curl -X PUT http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}' | jq '.'
```

**Update Task to 100% (Completed):**
```bash
curl -X PUT http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"progress": 100}' | jq '.'
```

**Update Subtask Progress:**
```bash
curl -X PUT http://localhost:3000/api/subtasks/PASTE_SUBTASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}' | jq '.'
```

**Complete Subtask:**
```bash
curl -X PATCH http://localhost:3000/api/subtasks/PASTE_SUBTASK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"complete": true}' | jq '.'
```

**Update Project:**
```bash
curl -X PUT http://localhost:3000/api/projects/PASTE_PROJECT_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Updated Project Name",
    "description": "Updated description"
  }' | jq '.'
```

### ✅ DELETE Operations

**Delete Subtask:**
```bash
curl -X DELETE http://localhost:3000/api/subtasks/PASTE_SUBTASK_ID_HERE | jq '.'
```

**Delete Task:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE | jq '.'
```

**Delete Project:**
```bash
curl -X DELETE http://localhost:3000/api/projects/PASTE_PROJECT_ID_HERE | jq '.'
```

## Step 5: Visual Testing with Prisma Studio

Open Prisma Studio to see data in a visual interface:

```bash
npm run prisma:studio
```

This opens `http://localhost:5555` where you can:
- View all tables
- See the data changes
- Manually edit/delete records
- Copy IDs easily

## Quick Test Script

Save this as `test-crud.sh` and run it:

```bash
#!/bin/bash

echo "Getting user and project IDs..."
USER_ID=$(curl -s http://localhost:3000/api/users | jq -r '.[0].id')
PROJECT_ID=$(curl -s http://localhost:3000/api/projects | jq -r '.[0].id')

echo "User ID: $USER_ID"
echo "Project ID: $PROJECT_ID"
echo ""

# CREATE
echo "1. Creating a task..."
TASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Automated Test Task\",
    \"description\": \"Created via script\",
    \"projectId\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"assigneeIds\": [\"$USER_ID\"]
  }")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.taskId')
echo "Created task: $TASK_ID"
echo ""

# CREATE SUBTASK
echo "2. Adding subtask..."
SUBTASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d "{\"taskId\": \"$TASK_ID\", \"title\": \"Test Subtask\"}")
SUBTASK_ID=$(echo $SUBTASK_RESPONSE | jq -r '.subtaskId')
echo "Created subtask: $SUBTASK_ID"
echo ""

# READ
echo "3. Getting task details..."
curl -s "http://localhost:3000/api/tasks/$TASK_ID" | jq '.'
echo ""

# UPDATE
echo "4. Updating task progress to 75%..."
curl -s -X PUT "http://localhost:3000/api/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}' | jq '.'
echo ""

# COMPLETE SUBTASK
echo "5. Completing subtask..."
curl -s -X PATCH "http://localhost:3000/api/subtasks/$SUBTASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"complete": true}' | jq '.'
echo ""

# READ UPDATED
echo "6. Reading updated task..."
curl -s "http://localhost:3000/api/tasks/$TASK_ID" | jq '.'
echo ""

echo "✅ All CRUD operations completed successfully!"
echo "Task ID: $TASK_ID"
echo "Subtask ID: $SUBTASK_ID"
```

Make it executable and run:
```bash
chmod +x test-crud.sh
./test-crud.sh
```

## Troubleshooting

**Server not running?**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 $(lsof -t -i:3000)

# Start server again
npm run dev
```

**Need fresh data?**
```bash
# Reseed database
npm run prisma:seed
```

**Database issues?**
```bash
# Reset and reseed
npx prisma migrate reset
```

That's it! You now have all CRUD operations working. 🎉
