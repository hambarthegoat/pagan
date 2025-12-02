# Architecture Documentation - Task Tracking System

## Overview
This document describes the implementation of the Task Tracking System following **Layered Architecture** and incorporating the **Observer** and **Strategy** design patterns.

## Layered Architecture

### 1. Domain Layer (`lib/domain/`)
The **Domain Layer** contains the core business logic and is independent of external frameworks.

#### Entities
All entities are encapsulated with private properties and public methods:

- **User** (`lib/domain/entities/User.ts`)
  - Properties: id, name, email, password
  - Methods: login(), logout(), viewDashboard(), updateProfile()

- **Role** (`lib/domain/entities/Role.ts`)
  - Properties: id, roleName, permissions
  - Methods: addPermission(), removePermission(), hasPermission()

- **Project** (`lib/domain/entities/Project.ts`)
  - Properties: id, projectName, description, createdAt, members
  - Methods: addMember(), removeMember(), getMembers()

- **Task** (`lib/domain/entities/Task.ts`)
  - Properties: id, title, description, deadline, progress, status, assignees
  - Methods: setDeadline(), updateProgress(), addAssignee(), removeAssignee(), changeStatus()

- **Subtask** (`lib/domain/entities/Subtask.ts`)
  - Properties: id, title, progress, status
  - Methods: updateProgress(), changeStatus()

- **Comment** (`lib/domain/entities/Comment.ts`)
  - Properties: id, content, createdAt
  - Methods: edit(), delete()

- **FileAttachment** (`lib/domain/entities/FileAttachment.ts`)
  - Properties: id, fileName, fileType, fileSize, uploadedAt, filePath
  - Methods: upload(), delete()

### 2. Infrastructure Layer (`lib/infrastructure/`)
The **Infrastructure Layer** handles data persistence and external services.

#### Repositories
- **ProjectRepository** - Manages Project persistence
- **TaskRepository** - Manages Task persistence
- **UserRepository** - Manages User persistence

#### Services
- **EmailService** - Handles email notifications (Observer)
- **NotificationService** - Handles in-app notifications (Observer)
- **FileStorageService** - Manages file uploads and storage

#### Database
- **Prisma Client** - Database connection with PostgreSQL adapter

### 3. Application Layer (`lib/application/`)
The **Application Layer** orchestrates business logic using domain entities and infrastructure services.

#### Services

**ProjectService** (`lib/application/services/ProjectService.ts`)
Implements Sequence Diagram 1:
- `createProject(data)` - Creates project and adds creator as member
- `inviteMembers(projectId, emailList)` - Validates users and sends invitations via Observer pattern
- `getProject(projectId)` - Retrieves project details
- `getUserProjects(userId)` - Gets all projects for a user

**TaskService** (`lib/application/services/TaskService.ts`)
Implements Sequence Diagrams 2 & 3:
- `createTask(data)` - Creates task with assignees and deadline
- `updateProgress(taskId, value)` - Updates progress using Strategy pattern
- `attachFile(taskId, userId, file...)` - Uploads file to task
- `getTask(taskId)` - Retrieves task details
- `getTasksByProject(projectId)` - Gets all tasks for a project

### 4. Presentation Layer (`app/`)
The **Presentation Layer** provides the user interface and API endpoints.

#### API Routes
All API routes follow RESTful conventions:

- **Projects** (`app/api/projects/route.ts`)
  - POST - Create project
  - GET - Get projects (all, by ID, by userId)

- **Tasks** (`app/api/tasks/route.ts`)
  - POST - Create task
  - GET - Get tasks (all, by ID, by projectId)

- **Task Progress** (`app/api/tasks/[id]/progress/route.ts`)
  - PATCH - Update task progress

- **Task Files** (`app/api/tasks/[id]/files/route.ts`)
  - POST - Upload file
  - GET - Get task files

- **Users** (`app/api/users/route.ts`)
  - POST - Register/Login user
  - GET - Get users (all, by ID, by email)

#### UI Components
- **Dashboard** - Overview with stats and recent activity
- **ProjectsPage** - List all projects
- **ProjectDetail** - Detailed project view with tasks
- **TaskDetail** - Detailed task view with progress, files, comments
- **UserProfile** - User profile management
- **Navigation** - Main navigation component

## Design Patterns

### Observer Pattern
**Location**: `lib/domain/patterns/Observer.ts`

**Purpose**: Decouple notification logic from business logic

**Components**:
1. **Observer Interface** - Defines update() method
2. **Subject Interface** - Defines attach(), detach(), notify() methods
3. **NotificationSubject** - Concrete implementation of Subject
4. **Observers**:
   - EmailService - Sends email notifications
   - NotificationService - Sends in-app notifications

**Implementation Flow**:
```typescript
// In ProjectService
const notificationSubject = new NotificationSubject();
notificationSubject.attach(emailService);
notificationSubject.notify({
  type: 'project_invitation',
  emails: validEmails,
  projectId
});

// In TaskService
notificationSubject.attach(notificationService);
notificationSubject.attach(emailService);
notificationSubject.notify({
  type: 'task_assigned',
  task: taskData
});
```

**Benefits**:
- Loose coupling between business logic and notification logic
- Easy to add new notification channels (SMS, push, etc.)
- Follows Open/Closed Principle

### Strategy Pattern
**Location**: `lib/domain/patterns/Strategy.ts`

**Purpose**: Different algorithms for status updates based on progress

**Strategies**:
1. **DefaultStatusStrategy**
   - 0% = Pending
   - 1-99% = In Progress
   - 100% = Completed

2. **AggressiveStatusStrategy**
   - 0% = Pending
   - 1-89% = In Progress
   - 90-100% = Completed

3. **ConservativeStatusStrategy**
   - 0% = Pending
   - 1-99% = In Progress
   - 100% = Completed (strict)

**Implementation Flow**:
```typescript
// In TaskService
const statusContext = new StatusContext(new DefaultStatusStrategy());
const newStatus = statusContext.executeStrategy(progress);
task.changeStatus(newStatus);
```

**Benefits**:
- Flexible status update algorithms
- Easy to switch strategies at runtime
- Follows Strategy Pattern principle

## Sequence Diagram Implementations

### Sequence Diagram 1: Create Project & Invite Members
**Implementation**: `ProjectService.createProject()`

```
Leader → UI: Submit project data
UI → ProjectService: createProject(data)
ProjectService → Project: new Project(data)
ProjectService → Project: addMember(leader)
ProjectService → ProjectRepository: save(project)
ProjectService → ProjectService: inviteMembers(emailList)
ProjectService → UserRepository: validateUser(email)
ProjectService → ProjectRepository: addMember(projectId, userId)
ProjectService → NotificationSubject: notify(invitation)
NotificationSubject → EmailService: update(data)
EmailService: sendInvitations(emails)
```

### Sequence Diagram 2: Create Task
**Implementation**: `TaskService.createTask()`

```
Leader → UI: Input task data
UI → TaskService: createTask(data)
TaskService → Task: new Task(data)
TaskService → Task: setDeadline(date)
TaskService → UserRepository: findById(memberId)
TaskService → Task: addAssignee(user)
TaskService → TaskRepository: save(task)
TaskService → TaskRepository: addAssignment(taskId, userId)
TaskService → NotificationSubject: notify(task_assigned)
NotificationSubject → EmailService: update(data)
NotificationSubject → NotificationService: update(data)
```

### Sequence Diagram 3: View Task + Update Progress + Upload File
**Implementation**: `TaskService` methods

**View Task**:
```
User → UI: Open task
UI → TaskService: getTask(taskId)
TaskService → TaskRepository: findById(taskId)
TaskRepository → TaskService: task data
TaskService → UI: Task object
```

**Update Progress**:
```
User → UI: Submit progress
UI → TaskService: updateProgress(taskId, value)
TaskService → TaskRepository: findById(taskId)
TaskService → Task: updateProgress(value)
TaskService → StatusContext: executeStrategy(value)
TaskService → Task: changeStatus(newStatus)
TaskService → TaskRepository: save(task)
TaskService → NotificationSubject: notify(task_updated)
```

**Upload File**:
```
User → UI: Upload file
UI → FileStorageService: upload(file)
FileStorageService → UI: filePath
UI → TaskService: attachFile(taskId, filePath)
TaskService → TaskRepository: findById(taskId)
TaskService → FileAttachment: new FileAttachment(data)
TaskService → FileStorageService: saveFileAttachment(data)
TaskService → UI: File upload success
```

## Database Schema

Based on the class diagram, implemented with Prisma:

```prisma
User ↔ Role (1:1)
User → Project (1:n) as creator
User ↔ Project (n:m) via ProjectMember
User ↔ Task (n:m) via Assignment
User → Comment (1:n)
User → FileAttachment (1:n)

Project → Task (1:n)

Task → Subtask (1:n)
Task → Comment (1:n)
Task → FileAttachment (1:n)
Task ↔ User (n:m) via Assignment
```

## Key Principles Applied

### 1. Separation of Concerns
- Each layer has a distinct responsibility
- Domain logic is separated from infrastructure
- Presentation is separated from business logic

### 2. Dependency Inversion
- High-level modules (Application) don't depend on low-level modules (Infrastructure)
- Both depend on abstractions (Domain entities and interfaces)

### 3. Encapsulation
- All entity properties are private
- Access only through public methods
- Business rules enforced in domain entities

### 4. Single Responsibility
- Each class has one reason to change
- Repositories handle persistence only
- Services handle business orchestration only
- Entities handle business rules only

### 5. Open/Closed Principle
- New observers can be added without modifying existing code
- New strategies can be added without changing the context

## Benefits of This Architecture

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Changes in one layer don't affect others
3. **Scalability**: Easy to add new features without modifying existing code
4. **Flexibility**: Easy to switch implementations (e.g., change database, add notification channels)
5. **Clear Structure**: Easy for new developers to understand the codebase
