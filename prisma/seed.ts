// Seed file to populate initial data
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const userRole = await prisma.role.upsert({
    where: { roleName: 'User' },
    update: {},
    create: {
      roleName: 'User',
      permissions: ['read', 'write', 'create_project', 'create_task'],
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { roleName: 'Admin' },
    update: {},
    create: {
      roleName: 'Admin',
      permissions: ['read', 'write', 'create_project', 'create_task', 'delete', 'admin'],
    },
  });

  console.log('✅ Roles created');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      roleId: userRole.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      roleId: userRole.id,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Users created');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      projectName: 'Website Redesign',
      description: 'Complete redesign of company website',
      creatorId: user1.id,
      members: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      projectName: 'Mobile App Development',
      description: 'Build a new mobile application',
      creatorId: user2.id,
      members: {
        create: [
          { userId: user2.id },
          { userId: admin.id },
        ],
      },
    },
  });

  console.log('✅ Projects created');

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design landing page',
      description: 'Create mockups and designs for the new landing page',
      projectId: project1.id,
      deadline: new Date('2025-12-15'),
      progress: 65,
      status: 'In Progress',
      priority: 'High',
      assignments: {
        create: [{ userId: user1.id }],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement authentication',
      description: 'Add user authentication with OAuth2',
      projectId: project2.id,
      deadline: new Date('2025-12-20'),
      progress: 40,
      status: 'In Progress',
      priority: 'High',
      assignments: {
        create: [{ userId: user2.id }],
      },
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Write API documentation',
      description: 'Document all API endpoints',
      projectId: project1.id,
      deadline: new Date('2025-12-25'),
      progress: 20,
      status: 'Pending',
      priority: 'Medium',
      assignments: {
        create: [{ userId: user1.id }, { userId: user2.id }],
      },
    },
  });

  console.log('✅ Tasks created');

  // Create subtasks
  await prisma.subtask.createMany({
    data: [
      {
        title: 'Create wireframes',
        taskId: task1.id,
        progress: 100,
        status: 'Completed',
      },
      {
        title: 'Design color scheme',
        taskId: task1.id,
        progress: 80,
        status: 'In Progress',
      },
      {
        title: 'Setup OAuth provider',
        taskId: task2.id,
        progress: 60,
        status: 'In Progress',
      },
    ],
  });

  console.log('✅ Subtasks created');

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'Great progress on the designs!',
        userId: user2.id,
        taskId: task1.id,
      },
      {
        content: 'Need help with the OAuth integration?',
        userId: admin.id,
        taskId: task2.id,
      },
    ],
  });

  console.log('✅ Comments created');
  console.log('🎉 Seeding completed successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('Email: john@example.com | Password: password123');
  console.log('Email: jane@example.com | Password: password123');
  console.log('Email: admin@example.com | Password: password123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
