// Infrastructure Layer: User Repository
import { prisma } from '../database/prisma';
import { User } from '@/lib/domain/entities/User';

export class UserRepository {
  async save(user: User, roleId: string): Promise<void> {
    const data = user.toObject();
    
    await prisma.user.upsert({
      where: { id: data.id },
      update: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      create: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: roleId,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { id },
    });

    if (!userData) return null;

    return new User({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({
      where: { email },
    });

    if (!userData) return null;

    return new User({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users.map(
      (u) =>
        new User({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
        })
    );
  }

  async validateUser(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async findManyByIds(ids: string[]): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return users.map(
      (u) =>
        new User({
          id: u.id,
          name: u.name,
          email: u.email,
          password: u.password,
        })
    );
  }
}
