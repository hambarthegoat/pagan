// // Strategy Pattern: Status Update Strategy

// // Strategy Interface
// export interface StatusStrategy {
//   updateStatus(progress: number): string;
// }

// // Concrete Strategy: Default Status Strategy
// export class DefaultStatusStrategy implements StatusStrategy {
//   updateStatus(progress: number): string {
//     if (progress === 0) {
//       return 'Pending';
//     } else if (progress === 100) {
//       return 'Completed';
//     } else {
//       return 'In Progress';
//     }
//   }
// }

// // Concrete Strategy: Aggressive Status Strategy (marks as completed at 90%)
// export class AggressiveStatusStrategy implements StatusStrategy {
//   updateStatus(progress: number): string {
//     if (progress === 0) {
//       return 'Pending';
//     } else if (progress >= 90) {
//       return 'Completed';
//     } else {
//       return 'In Progress';
//     }
//   }
// }

// // Concrete Strategy: Conservative Status Strategy (requires 100% for completion)
// export class ConservativeStatusStrategy implements StatusStrategy {
//   updateStatus(progress: number): string {
//     if (progress === 0) {
//       return 'Pending';
//     } else if (progress < 100) {
//       return 'In Progress';
//     } else {
//       return 'Completed';
//     }
//   }
// }

// // Context class that uses the strategy
// export class StatusContext {
//   private strategy: StatusStrategy;

//   constructor(strategy: StatusStrategy) {
//     this.strategy = strategy;
//   }

//   setStrategy(strategy: StatusStrategy): void {
//     this.strategy = strategy;
//   }

//   executeStrategy(progress: number): string {
//     return this.strategy.updateStatus(progress);
//   }
// }


export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Overdue = 'Overdue'
}

export interface TaskProgressContext {
  progress: number;
  priority?: number;
  isOverdue?: boolean;
}

export interface StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus;
}

export class DefaultStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress === 100) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}

export class AggressiveStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress >= 90) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}

export class ConservativeStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress } = context;
    if (progress === 0) return TaskStatus.Pending;
    if (progress < 100) return TaskStatus.InProgress;
    return TaskStatus.Completed;
  }
}

export class DeadlineAwareStatusStrategy implements StatusStrategy {
  updateStatus(context: TaskProgressContext): TaskStatus {
    const { progress, isOverdue } = context;
    if (isOverdue && progress < 100) return TaskStatus.Overdue;
    if (progress === 0) return TaskStatus.Pending;
    if (progress === 100) return TaskStatus.Completed;
    return TaskStatus.InProgress;
  }
}

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

const strategy = StatusStrategyFactory.create('deadline');
const statusContext = new StatusContext(strategy);

const taskProgress: TaskProgressContext = {
  progress: 85,
  priority: 3,
  isOverdue: true
};

const status = statusContext.getStatus(taskProgress);
console.log('Status:', status);
