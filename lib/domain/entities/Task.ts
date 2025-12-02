// Domain Entity: Task
import { User } from './User';

export class Task {
  private id: string;
  private title: string;
  private description: string;
  private deadline: Date | null;
  private progress: number;
  private status: string;
  private assignees: User[];

  constructor(data: {
    id: string;
    title: string;
    description: string;
    deadline?: Date | null;
    progress?: number;
    status?: string;
    assignees?: User[];
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.deadline = data.deadline || null;
    this.progress = data.progress || 0;
    this.status = data.status || 'Pending';
    this.assignees = data.assignees || [];
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getDeadline(): Date | null {
    return this.deadline;
  }

  getProgress(): number {
    return this.progress;
  }

  getStatus(): string {
    return this.status;
  }

  getAssignees(): User[] {
    return [...this.assignees];
  }

  // Business methods
  setDeadline(date: Date): void {
    this.deadline = date;
  }

  updateProgress(value: number): void {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    this.progress = value;
    
    // Auto-update status based on progress
    this.autoUpdateStatus();
  }

  addAssignee(user: User): void {
    const exists = this.assignees.some(a => a.getId() === user.getId());
    if (!exists) {
      this.assignees.push(user);
    }
  }

  removeAssignee(userId: string): void {
    this.assignees = this.assignees.filter(a => a.getId() !== userId);
  }

  changeStatus(newStatus: string): void {
    this.status = newStatus;
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

  toObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      progress: this.progress,
      status: this.status,
    };
  }
}
