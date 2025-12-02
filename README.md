# Task Tracking System - Pagan

A full-stack task tracking application built with Next.js, Prisma, and PostgreSQL, implementing **Layered Architecture**, **Observer Pattern**, and **Strategy Pattern**.

## 🏗️ Architecture

This project follows a **Layered Architecture** pattern:

### 1. **Domain Layer** (`lib/domain/`)
- **Entities**: Core business objects (User, Project, Task, etc.)
- **Design Patterns**:
  - **Observer Pattern**: For notifications and event handling
  - **Strategy Pattern**: For status update strategies

### 2. **Infrastructure Layer** (`lib/infrastructure/`)
- **Repositories**: Data persistence (ProjectRepository, TaskRepository, UserRepository)
- **Services**: External services (EmailService, NotificationService, FileStorageService)
- **Database**: Prisma client configuration

### 3. **Application Layer** (`lib/application/`)
- **Services**: Business logic orchestration (ProjectService, TaskService)
- Implements use cases from sequence diagrams

### 4. **Presentation Layer** (`app/`)
- **API Routes**: RESTful endpoints
- **UI Components**: React components
- **Pages**: Next.js pages

## 📋 Features

### Implemented Sequence Diagrams:

#### 1. **Create Project & Invite Members**
- Create project with name and description
- Add leader as initial member
- Invite members via email
- Send email notifications (Observer pattern)

#### 2. **Create Task**
- Create task with title, description
- Set deadline
- Add assignees
- Notify assignees (Observer pattern)

#### 3. **View Task & Update Progress**
- View task details
- Update task progress
- Auto-update status using Strategy pattern
- Upload file attachments

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL (local or remote)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
Update `.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pagan?schema=public"
```

3. **Create the database**:
```bash
createdb pagan
```

4. **Run Prisma migrations**:
```bash
npm run prisma:migrate
```

5. **Generate Prisma client**:
```bash
npm run prisma:generate
```

6. **Seed the database**:
```bash
npm run prisma:seed
```

7. **Start the development server**:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Test Credentials

After seeding, use these credentials to login:

```
Email: john@example.com
Password: password123

Email: jane@example.com
Password: password123

Email: admin@example.com
Password: password123
```

## 🎯 Design Patterns

### Observer Pattern
Located in `lib/domain/patterns/Observer.ts`

**Purpose**: Implement notification system for task assignments and project invitations

**Implementation**:
- `NotificationSubject`: Subject that notifies observers
- `EmailService`: Observer for email notifications
- `NotificationService`: Observer for in-app notifications

**Usage Example**:
```typescript
const notificationSubject = new NotificationSubject();
notificationSubject.attach(emailService);
notificationSubject.notify({ type: 'task_assigned', task: taskData });
```

### Strategy Pattern
Located in `lib/domain/patterns/Strategy.ts`

**Purpose**: Different strategies for updating task status based on progress

**Strategies**:
- `DefaultStatusStrategy`: 0% = Pending, 1-99% = In Progress, 100% = Completed
- `AggressiveStatusStrategy`: Marks as completed at 90%
- `ConservativeStatusStrategy`: Requires exactly 100% for completion

**Usage Example**:
```typescript
const context = new StatusContext(new DefaultStatusStrategy());
const newStatus = context.executeStrategy(progress);
```

## 📁 Project Structure

```
pagan/
├── app/                          # Presentation Layer
│   ├── api/                      # API Routes
│   │   ├── projects/             # Project endpoints
│   │   ├── tasks/                # Task endpoints
│   │   └── users/                # User endpoints
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/                   # UI Components
│   ├── Dashboard.tsx
│   ├── Navigation.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetail.tsx
│   ├── TaskDetail.tsx
│   └── UserProfile.tsx
├── lib/                          # Core Business Logic
│   ├── domain/                   # Domain Layer
│   │   ├── entities/             # Domain entities
│   │   └── patterns/             # Design Patterns
│   ├── application/              # Application Layer
│   │   └── services/
│   └── infrastructure/           # Infrastructure Layer
│       ├── database/
│       ├── repositories/
│       └── services/
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
└── public/
    └── uploads/                  # File uploads directory
```

## 🗄️ Database Schema

Based on the class diagram:
- **User**: Users with roles and permissions
- **Role**: User roles with permission lists
- **Project**: Projects with members
- **Task**: Tasks with assignees, deadlines, progress
- **Subtask**: Subtasks within tasks
- **Assignment**: Many-to-many relationship (User ↔ Task)
- **Comment**: Comments on tasks
- **FileAttachment**: File attachments on tasks

## 🔌 API Endpoints

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - Get all projects
- `GET /api/projects?id={id}` - Get project by ID
- `GET /api/projects?userId={userId}` - Get user's projects

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?id={id}` - Get task by ID
- `GET /api/tasks?projectId={projectId}` - Get project tasks
- `PATCH /api/tasks/{id}/progress` - Update task progress
- `POST /api/tasks/{id}/files` - Upload file
- `GET /api/tasks/{id}/files` - Get task files

### Users
- `POST /api/users` - Register/Login user
- `GET /api/users` - Get all users
- `GET /api/users?id={id}` - Get user by ID
- `GET /api/users?email={email}` - Get user by email

## 🛠️ Development Commands

```bash
# Development
npm run dev                  # Start dev server

# Database
npm run prisma:generate      # Generate Prisma client
npm run prisma:migrate       # Run migrations
npm run prisma:seed          # Seed database
npm run prisma:studio        # Open Prisma Studio
npm run db:push              # Push schema to database

# Build
npm run build                # Build for production
npm run start                # Start production server
```

## 📝 Notes

- All passwords are hashed using bcrypt
- File uploads are stored in `public/uploads/`
- Observer pattern enables decoupled notification system
- Strategy pattern allows flexible status management
- Layered architecture ensures separation of concerns

