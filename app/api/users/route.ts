// API Route: User Authentication and Management
import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '@/lib/infrastructure/repositories/UserRepository';
import { User } from '@/lib/domain/entities/User';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/infrastructure/database/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, action } = body;

    if (action === 'login') {
      // Login user
      const userRepo = new UserRepository();
      const user = await userRepo.findByEmail(email);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.getPassword());
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
        },
      });
    }

    if (action === 'register') {
      // Register new user
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const userRepo = new UserRepository();
      const existing = await userRepo.findByEmail(email);
      
      if (existing) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create default role if not exists
      let role = await prisma.role.findUnique({
        where: { roleName: 'User' },
      });

      if (!role) {
        role = await prisma.role.create({
          data: {
            roleName: 'User',
            permissions: ['read', 'write'],
          },
        });
      }

      // Create user
      const user = new User({
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
      });

      await userRepo.save(user, role.id);

      return NextResponse.json({
        success: true,
        user: {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
        },
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const email = searchParams.get('email');

    const userRepo = new UserRepository();

    if (userId) {
      const user = await userRepo.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      });
    }

    if (email) {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
      });
    }

    const users = await userRepo.findAll();
    return NextResponse.json(
      users.map(u => ({
        id: u.getId(),
        name: u.getName(),
        email: u.getEmail(),
      }))
    );
  } catch (error) {
    console.error('Error in get users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
