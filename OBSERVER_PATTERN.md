# Observer Pattern Implementation

## Pattern Definition

The **Observer Pattern** defines a one-to-many dependency between objects where when one object changes state, all its dependents are notified and updated automatically.

## Implementation in This Project

### 1. Pattern Structure (`lib/domain/patterns/Observer.ts`)

```typescript
// Observer Interface
export interface Observer {
  update(data: any): void;
}

// Subject Interface
export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

// Concrete Subject
export class NotificationSubject implements Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    this.observers.push(observer);
  }
  
  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    this.observers.splice(index, 1);
  }
  
  notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}
```

### 2. Concrete Observers

#### EmailService (`lib/infrastructure/services/EmailService.ts`)
- Observes notifications
- Sends emails when tasks are assigned
- Sends project invitations

#### NotificationService (`lib/infrastructure/services/NotificationService.ts`)
- Observes notifications
- Creates in-app notifications
- Handles task updates and comments

### 3. Where It's Used

#### TaskService (`lib/application/services/TaskService.ts`)
```typescript
constructor() {
  this.notificationSubject = new NotificationSubject();
  
  // Attach observers
  this.notificationSubject.attach(this.notificationService);
  this.notificationSubject.attach(this.emailService);
}

// When creating a task
async createTask(data: CreateTaskData) {
  // ... create task logic
  
  // Notify all observers
  this.notificationSubject.notify({
    type: 'task_assigned',
    task: {
      id: taskId,
      title: data.title,
      assignees: assignees
    }
  });
}
```

#### ProjectService (`lib/application/services/ProjectService.ts`)
```typescript
async inviteMembers(projectId: string, emailList: string[]) {
  // ... validation logic
  
  // Notify all observers
  this.notificationSubject.notify({
    type: 'project_invitation',
    emails: validEmails,
    projectId
  });
}
```

## How to See It in Action

### Test 1: Create a Task (Triggers Observer)

```bash
# Start the server
npm run dev

# In another terminal, create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Observer Pattern",
    "description": "Watch the console for notifications",
    "projectId": "YOUR_PROJECT_ID",
    "assigneeIds": ["USER_ID_1", "USER_ID_2"]
  }'
```

**Expected Console Output:**
```
🔔 Notification Observer received: {
  type: 'task_assigned',
  task: { id: '...', title: 'Test Observer Pattern', assignees: [...] }
}
📧 Email Observer received notification: {
  type: 'task_assigned',
  task: { id: '...', title: 'Test Observer Pattern', assignees: [...] }
}
🔔 Notifying assignees about task: ...
📧 Notifying assignees: ...
Sending email to user1@example.com: New Task Assignment
Sending email to user2@example.com: New Task Assignment
```

### Test 2: Invite Project Members (Triggers Observer)

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Observer Test Project",
    "description": "Testing observer pattern",
    "creatorId": "YOUR_USER_ID",
    "memberEmails": ["john@example.com", "jane@example.com"]
  }'
```

**Expected Console Output:**
```
📧 Email Observer received notification: {
  type: 'project_invitation',
  emails: ['john@example.com', 'jane@example.com'],
  projectId: '...'
}
📧 Sending invitations to: ['john@example.com', 'jane@example.com']
Sending email to john@example.com: Project Invitation
Sending email to jane@example.com: Project Invitation
```

### Test 3: Update Task Progress (Triggers Observer)

```bash
curl -X PUT http://localhost:3000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"progress": 75}'
```

**Expected Console Output:**
```
🔔 Notification Observer received: {
  type: 'task_updated',
  task: { id: '...', title: '...', progress: 75, status: 'In Progress' }
}
🔔 Task updated notification: { id: '...', progress: 75 }
```

## Benefits of Observer Pattern in This Project

1. **Decoupling**: TaskService doesn't need to know about EmailService or NotificationService
2. **Extensibility**: Easy to add new observers (SMS, Slack, Discord, etc.)
3. **Single Responsibility**: Each observer handles its own notification method
4. **Open/Closed Principle**: Can add new notification types without modifying existing code

## Adding a New Observer

Want to add Slack notifications? Here's how:

### 1. Create SlackService

```typescript
// lib/infrastructure/services/SlackService.ts
import { Observer } from '@/lib/domain/patterns/Observer';

export class SlackService implements Observer {
  update(data: any): void {
    if (data.type === 'task_assigned') {
      this.sendSlackMessage(data.task);
    }
  }
  
  private async sendSlackMessage(taskData: any): Promise<void> {
    console.log('💬 Sending Slack notification:', taskData);
    // Integrate with Slack API
  }
}
```

### 2. Attach to Subject

```typescript
// In TaskService constructor
const slackService = new SlackService();
this.notificationSubject.attach(slackService);
```

That's it! No changes needed to existing code.

## Current Implementation Status

✅ Observer pattern fully implemented
✅ EmailService observer working
✅ NotificationService observer working
✅ Triggered on task creation
✅ Triggered on project invitations
✅ Triggered on task updates
✅ Console logging shows notifications
✅ Ready for real email/notification integration

## Next Steps for Production

1. **Replace console.log with real services:**
   - Integrate SendGrid/AWS SES for emails
   - Add database notifications table
   - Implement WebSocket for real-time updates

2. **Add more notification types:**
   - Task deadline approaching
   - Task completed
   - Comment added
   - File uploaded
   - Project status changed

3. **Add user preferences:**
   - Allow users to configure notification settings
   - Email vs in-app vs both
   - Notification frequency

The Observer pattern is working and ready! Check your server console when running the API operations to see it in action. 🎉
