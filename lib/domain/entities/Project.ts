// Domain Entity: Project
import { User } from './User';

export class Project {
  private id: string;
  private projectName: string;
  private description: string;
  private createdAt: Date;
  private members: User[];

  constructor(data: {
    id: string;
    projectName: string;
    description: string;
    createdAt?: Date;
    members?: User[];
  }) {
    this.id = data.id;
    this.projectName = data.projectName;
    this.description = data.description;
    this.createdAt = data.createdAt || new Date();
    this.members = data.members || [];
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getProjectName(): string {
    return this.projectName;
  }

  getDescription(): string {
    return this.description;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getMembers(): User[] {
    return [...this.members];
  }

  // Business methods
  addMember(user: User): void {
    const exists = this.members.some(m => m.getId() === user.getId());
    if (!exists) {
      this.members.push(user);
    }
  }

  removeMember(userId: string): void {
    this.members = this.members.filter(m => m.getId() !== userId);
  }

  toObject() {
    return {
      id: this.id,
      projectName: this.projectName,
      description: this.description,
      createdAt: this.createdAt,
    };
  }
}
