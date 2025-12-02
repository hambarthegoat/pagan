// Domain Entity: User
export class User {
  private id: string;
  private name: string;
  private email: string;
  private password: string;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  // Business methods
  login(): boolean {
    // Business logic for login validation
    return true;
  }

  logout(): void {
    // Business logic for logout
  }

  viewDashboard(): void {
    // Business logic for viewing dashboard
  }

  updateProfile(name?: string, email?: string): void {
    if (name) this.name = name;
    if (email) this.email = email;
  }

  // Convert to plain object for persistence
  toObject() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
    };
  }
}
