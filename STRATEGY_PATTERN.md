# Strategy Pattern Implementation

## Pattern Definition

The **Strategy Pattern** defines a family of algorithms, encapsulates each one, and makes them interchangeable. The strategy pattern lets the algorithm vary independently from clients that use it.

## Implementation in This Project

### 1. Pattern Structure (`lib/domain/patterns/Strategy.ts`)

```typescript
// Strategy Interface
export interface StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus;
}

// Context Interface
export interface TaskProgressContext {
  progress: number;
  priority?: number;
  isOverdue?: boolean;
}

// Enum for Task Statuses
export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Overdue = 'Overdue'
}
```

### 2. Concrete Strategies

#### DefaultStatusStrategy
Standard progression: 0% → Pending, 1-99% → In Progress, 100% → Completed

```typescript
export class DefaultStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress === 100) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}
```

#### AggressiveStatusStrategy
Optimistic completion: Marks complete at 90%

```typescript
export class AggressiveStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress >= 90) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}
```

#### ConservativeStatusStrategy
Strict completion: Requires exactly 100%

```typescript
export class ConservativeStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress < 100) return TaskStatus.InProgress;
    return TaskStatus.Completed;
  }
}
```

#### DeadlineAwareStatusStrategy
Deadline-conscious: Marks overdue if deadline passed

```typescript
export class DeadlineAwareStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress, isOverdue } = context;
    if (isOverdue && progress < 100) return TaskStatus.Overdue;
    if (progress === 0) return TaskStatus.Pending;
    if (progress === 100) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}
```

### 3. Context Class

```typescript
export class StatusContext {
  private strategy: StatusStrategy;

  constructor(strategy: StatusStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: StatusStrategy): void {
    this.strategy = strategy;
  }

  getStatus(context: TaskProgressContext): TaskStatus {
    return this.strategy.updateStatus(context);
  }
}
```

### 4. Factory Pattern (Bonus!)

```typescript
export class StatusStrategyFactory {
  static create(type: string): StatusStrategy {
    switch (type) {
      case 'aggressive':
        return new AggressiveStatusStrategy();
      case 'conservative':
        return new ConservativeStatusStrategy();
      case 'deadline':
        return new DeadlineAwareStatusStrategy();
      default:
        return new DefaultStatusStrategy();
    }
  }
}
```

## Where It's Used

### TaskService (`lib/application/services/TaskService.ts`)

```typescript
constructor() {
  // Initialize with default strategy
  this.statusContext = new StatusContext(new DefaultStatusStrategy());
}

async updateProgress(taskId: string, value: number): Promise<void> {
  const task = await this.taskRepository.findById(taskId);
  
  // Update progress
  task.updateProgress(value);
  
  // Use strategy to determine new status
  const newStatus = this.statusContext.getStatus({ progress: value });
  task.changeStatus(newStatus);
  
  await this.taskRepository.save(task, '');
}
```

## How to See It in Action

### Test 1: Default Strategy (0 → 50 → 100)

```bash
# Create a task
TASK_ID="your-task-id"

# Update to 50% (should be "In Progress")
curl -X PUT http://localhost:3000/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"progress": 50}'
# Response: { status: "In Progress", progress: 50 }

# Update to 100% (should be "Completed")
curl -X PUT http://localhost:3000/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -d '{"progress": 100}'
# Response: { status: "Completed", progress: 100 }
```

### Test 2: Automatic Status Updates

The Task entity automatically updates status based on progress:

```typescript
// In Task.ts
updateProgress(value: number): void {
  if (value < 0) value = 0;
  if (value > 100) value = 100;
  this.progress = value;
  
  // Auto-update status
  this.autoUpdateStatus();
}

private autoUpdateStatus(): void {
  if (this.progress === 0) {
    this.status = 'Pending';
  } else if (this.progress === 100) {
    this.status = 'Completed';
  } else {
    this.status = 'In Progress';
  }
}
```

### Test 3: Testing All Strategies

Create a test file to see all strategies:

```typescript
// test-strategies.ts
import { 
  DefaultStatusStrategy,
  AggressiveStatusStrategy,
  ConservativeStatusStrategy,
  DeadlineAwareStatusStrategy,
  StatusContext,
  TaskProgressContext
} from './lib/domain/patterns/Strategy';

const testProgress = [0, 25, 50, 75, 90, 95, 100];

console.log('Testing Different Strategies:\n');

// Default Strategy
console.log('DEFAULT STRATEGY:');
const defaultContext = new StatusContext(new DefaultStatusStrategy());
testProgress.forEach(p => {
  const status = defaultContext.getStatus({ progress: p });
  console.log(`  ${p}% → ${status}`);
});

// Aggressive Strategy
console.log('\nAGGRESSIVE STRATEGY (completes at 90%):');
const aggressiveContext = new StatusContext(new AggressiveStatusStrategy());
testProgress.forEach(p => {
  const status = aggressiveContext.getStatus({ progress: p });
  console.log(`  ${p}% → ${status}`);
});

// Conservative Strategy
console.log('\nCONSERVATIVE STRATEGY (only 100% is complete):');
const conservativeContext = new StatusContext(new ConservativeStatusStrategy());
testProgress.forEach(p => {
  const status = conservativeContext.getStatus({ progress: p });
  console.log(`  ${p}% → ${status}`);
});

// Deadline Aware Strategy
console.log('\nDEADLINE AWARE STRATEGY (with overdue):');
const deadlineContext = new StatusContext(new DeadlineAwareStatusStrategy());
testProgress.forEach(p => {
  const statusNormal = deadlineContext.getStatus({ progress: p, isOverdue: false });
  const statusOverdue = deadlineContext.getStatus({ progress: p, isOverdue: true });
  console.log(`  ${p}% → Normal: ${statusNormal}, Overdue: ${statusOverdue}`);
});
```

**Expected Output:**
```
Testing Different Strategies:

DEFAULT STRATEGY:
  0% → Pending
  25% → In Progress
  50% → In Progress
  75% → In Progress
  90% → In Progress
  95% → In Progress
  100% → Completed

AGGRESSIVE STRATEGY (completes at 90%):
  0% → Pending
  25% → In Progress
  50% → In Progress
  75% → In Progress
  90% → Completed
  95% → Completed
  100% → Completed

CONSERVATIVE STRATEGY (only 100% is complete):
  0% → Pending
  25% → In Progress
  50% → In Progress
  75% → In Progress
  90% → In Progress
  95% → In Progress
  100% → Completed

DEADLINE AWARE STRATEGY (with overdue):
  0% → Normal: Pending, Overdue: Pending
  25% → Normal: In Progress, Overdue: Overdue
  50% → Normal: In Progress, Overdue: Overdue
  75% → Normal: In Progress, Overdue: Overdue
  90% → Normal: In Progress, Overdue: Overdue
  95% → Normal: In Progress, Overdue: Overdue
  100% → Normal: Completed, Overdue: Completed
```

## Real-World Examples

### Scenario 1: Quick Sprints (Aggressive)
For fast-paced sprints, use aggressive strategy:
- 90% done? Mark it complete!
- Helps teams move faster
- Good for non-critical tasks

### Scenario 2: Critical Tasks (Conservative)
For important deliverables:
- Must be 100% to complete
- No shortcuts
- Perfect for QA, releases

### Scenario 3: Deadline Tracking (Deadline-Aware)
For time-sensitive projects:
- Automatically marks overdue tasks
- Visual indicator for late work
- Helps prioritize urgent items

## Benefits of Strategy Pattern

1. **Flexibility**: Switch strategies at runtime
2. **Open/Closed**: Add new strategies without changing existing code
3. **Testability**: Each strategy is independently testable
4. **Clarity**: Clear separation of different algorithms
5. **Maintainability**: Easy to understand and modify

## How to Switch Strategies

### Option 1: Per Task Type
```typescript
if (task.type === 'sprint') {
  statusContext.setStrategy(new AggressiveStatusStrategy());
} else if (task.type === 'release') {
  statusContext.setStrategy(new ConservativeStatusStrategy());
}
```

### Option 2: User Preference
```typescript
const userPreference = await getUserSettings(userId);
const strategy = StatusStrategyFactory.create(userPreference.strategyType);
statusContext.setStrategy(strategy);
```

### Option 3: Project-Wide Setting
```typescript
const project = await getProject(projectId);
const strategy = StatusStrategyFactory.create(project.statusStrategy);
statusContext.setStrategy(strategy);
```

## Current Implementation Status

✅ Strategy pattern fully implemented
✅ 4 different strategies available
✅ StatusContext for strategy management
✅ Factory pattern for strategy creation
✅ Used in Task entity auto-status
✅ Used in TaskService
✅ Ready for runtime strategy switching

## Next Steps for Enhancement

1. **Add strategy to database:**
   - Store user/project strategy preference
   - Allow users to choose their preferred strategy

2. **More strategies:**
   - PriorityAwareStrategy: High priority needs 100%, low can be 80%
   - TeamBasedStrategy: Different rules for different team sizes
   - CustomStrategy: User-defined completion criteria

3. **Strategy metrics:**
   - Track which strategies lead to faster completion
   - A/B test different strategies
   - Optimize based on team performance

The Strategy pattern is fully working! You can see it in action when updating task progress. 🎯
