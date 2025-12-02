// Domain Entity: Role
export class Role {
  private id: string;
  private roleName: string;
  private permissions: string[];

  constructor(data: {
    id: string;
    roleName: string;
    permissions: string[];
  }) {
    this.id = data.id;
    this.roleName = data.roleName;
    this.permissions = data.permissions || [];
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getRoleName(): string {
    return this.roleName;
  }

  getPermissions(): string[] {
    return [...this.permissions];
  }

  // Business methods
  addPermission(permission: string): void {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission: string): void {
    this.permissions = this.permissions.filter(p => p !== permission);
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  toObject() {
    return {
      id: this.id,
      roleName: this.roleName,
      permissions: [...this.permissions],
    };
  }
}
