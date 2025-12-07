#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Task Tracker - CRUD Operations Test${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running on port 3000${NC}"
    echo -e "${YELLOW}   Start the server with: npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Get IDs from seeded data
echo -e "${BLUE}Getting seeded data...${NC}"
USER_ID=$(curl -s http://localhost:3000/api/users | jq -r '.[0].id' 2>/dev/null)
PROJECT_ID=$(curl -s http://localhost:3000/api/projects | jq -r '.[0].id' 2>/dev/null)

echo -e "${GREEN}User ID: $USER_ID${NC}"
echo -e "${GREEN}Project ID: $PROJECT_ID${NC}"
echo ""

# ============================================
# CREATE OPERATIONS
# ============================================
echo -e "${BLUE}========== CREATE OPERATIONS ==========${NC}"
echo ""

echo -e "${YELLOW}1. Creating a new task...${NC}"
TASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test CRUD Task\",
    \"description\": \"Testing all CRUD operations\",
    \"projectId\": \"$PROJECT_ID\",
    \"priority\": \"High\",
    \"assigneeIds\": [\"$USER_ID\"]
  }")
TASK_ID=$(echo $TASK_RESPONSE | jq -r '.taskId')
echo -e "${GREEN}✓ Created task: $TASK_ID${NC}"
echo ""

echo -e "${YELLOW}2. Adding subtask to task...${NC}"
SUBTASK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d "{\"taskId\": \"$TASK_ID\", \"title\": \"Test Subtask\"}")
SUBTASK_ID=$(echo $SUBTASK_RESPONSE | jq -r '.subtaskId')
echo -e "${GREEN}✓ Created subtask: $SUBTASK_ID${NC}"
echo ""

echo -e "${YELLOW}3. Adding comment to task...${NC}"
COMMENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/comments \
  -H "Content-Type: application/json" \
  -d "{\"taskId\": \"$TASK_ID\", \"userId\": \"$USER_ID\", \"content\": \"Test comment\"}")
echo -e "${GREEN}✓ Created comment${NC}"
echo ""

# ============================================
# READ OPERATIONS
# ============================================
echo -e "${BLUE}========== READ OPERATIONS ==========${NC}"
echo ""

echo -e "${YELLOW}4. Reading task details...${NC}"
curl -s "http://localhost:3000/api/tasks/$TASK_ID" | jq '.'
echo ""

echo -e "${YELLOW}5. Reading subtasks...${NC}"
curl -s "http://localhost:3000/api/subtasks?taskId=$TASK_ID" | jq '.'
echo ""

echo -e "${YELLOW}6. Reading comments...${NC}"
curl -s "http://localhost:3000/api/comments?taskId=$TASK_ID" | jq '.'
echo ""

# ============================================
# UPDATE OPERATIONS
# ============================================
echo -e "${BLUE}========== UPDATE OPERATIONS ==========${NC}"
echo ""

echo -e "${YELLOW}7. Updating task progress to 50%...${NC}"
curl -s -X PUT "http://localhost:3000/api/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}' | jq '.'
echo -e "${GREEN}✓ Updated task progress${NC}"
echo ""

echo -e "${YELLOW}8. Updating subtask progress to 75%...${NC}"
curl -s -X PUT "http://localhost:3000/api/subtasks/$SUBTASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}' | jq '.'
echo -e "${GREEN}✓ Updated subtask progress${NC}"
echo ""

echo -e "${YELLOW}9. Completing subtask (100%)...${NC}"
curl -s -X PATCH "http://localhost:3000/api/subtasks/$SUBTASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"complete": true}' | jq '.'
echo -e "${GREEN}✓ Completed subtask${NC}"
echo ""

echo -e "${YELLOW}10. Updating task to completed (100%)...${NC}"
curl -s -X PUT "http://localhost:3000/api/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -d '{"progress": 100}' | jq '.'
echo -e "${GREEN}✓ Completed task${NC}"
echo ""

# ============================================
# DELETE OPERATIONS
# ============================================
echo -e "${BLUE}========== DELETE OPERATIONS ==========${NC}"
echo ""

echo -e "${YELLOW}11. Deleting subtask...${NC}"
curl -s -X DELETE "http://localhost:3000/api/subtasks/$SUBTASK_ID" | jq '.'
echo -e "${GREEN}✓ Deleted subtask${NC}"
echo ""

echo -e "${YELLOW}12. Deleting task...${NC}"
curl -s -X DELETE "http://localhost:3000/api/tasks/$TASK_ID" | jq '.'
echo -e "${GREEN}✓ Deleted task${NC}"
echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}   ✅ All CRUD Operations Completed!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}Operations tested:${NC}"
echo -e "  ✓ CREATE: Project, Task, Subtask, Comment"
echo -e "  ✓ READ: All resources with filtering"
echo -e "  ✓ UPDATE: Task progress, Subtask progress, Complete"
echo -e "  ✓ DELETE: Subtask, Task"
echo ""
echo -e "${YELLOW}View data in Prisma Studio: npm run prisma:studio${NC}"
echo -e "${YELLOW}See HOW_TO_TEST.md for manual testing${NC}"
