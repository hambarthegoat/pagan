// Domain Entity: Subtask
export class Subtask {
  private id: string;
  private title: string;
  private progress: number;
  private status: string;

  constructor(data: {
    id: string;
    title: string;
    progress?: number;
    status?: string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.progress = data.progress || 0;
    this.status = data.status || 'Pending';
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getProgress(): number {
    return this.progress;
  }

  getStatus(): string {
    return this.status;
  }

  // Business methods
  updateProgress(value: number): void {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    this.progress = value;
    
    // Auto-update status based on progress
    if (value === 0) {
      this.status = 'Pending';
    } else if (value === 100) {
      this.status = 'Completed';
    } else {
      this.status = 'In Progress';
    }
  }

  changeStatus(newStatus: string): void {
    this.status = newStatus;
  }

  toObject() {
    return {
      id: this.id,
      title: this.title,
      progress: this.progress,
      status: this.status,
    };
  }
}
