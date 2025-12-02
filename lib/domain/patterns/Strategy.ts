// Strategy Pattern: Status Update Strategy

// Strategy Interface
export interface StatusStrategy {
  updateStatus(progress: number): string;
}

// Concrete Strategy: Default Status Strategy
export class DefaultStatusStrategy implements StatusStrategy {
  updateStatus(progress: number): string {
    if (progress === 0) {
      return 'Pending';
    } else if (progress === 100) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }
}

// Concrete Strategy: Aggressive Status Strategy (marks as completed at 90%)
export class AggressiveStatusStrategy implements StatusStrategy {
  updateStatus(progress: number): string {
    if (progress === 0) {
      return 'Pending';
    } else if (progress >= 90) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }
}

// Concrete Strategy: Conservative Status Strategy (requires 100% for completion)
export class ConservativeStatusStrategy implements StatusStrategy {
  updateStatus(progress: number): string {
    if (progress === 0) {
      return 'Pending';
    } else if (progress < 100) {
      return 'In Progress';
    } else {
      return 'Completed';
    }
  }
}

// Context class that uses the strategy
export class StatusContext {
  private strategy: StatusStrategy;

  constructor(strategy: StatusStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: StatusStrategy): void {
    this.strategy = strategy;
  }

  executeStrategy(progress: number): string {
    return this.strategy.updateStatus(progress);
  }
}
