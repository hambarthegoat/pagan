// Domain Entity: Comment
export class Comment {
  private id: string;
  private content: string;
  private createdAt: Date;

  constructor(data: {
    id: string;
    content: string;
    createdAt?: Date;
  }) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt || new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getContent(): string {
    return this.content;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  // Business methods
  edit(newContent: string): void {
    this.content = newContent;
  }

  delete(): void {
    // Mark for deletion - actual deletion handled by repository
  }

  toObject() {
    return {
      id: this.id,
      content: this.content,
      createdAt: this.createdAt,
    };
  }
}
