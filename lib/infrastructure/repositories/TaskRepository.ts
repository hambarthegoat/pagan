// Infrastructure Layer: Task Repository
import { prisma } from '../database/prisma';
import { Task } from '@/lib/domain/entities/Task';
import { User } from '@/lib/domain/entities/User';

export class TaskRepository {
  async save(task: Task, projectId: string): Promise<void> {
    const data = task.toObject();
    
    await prisma.task.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        progress: data.progress,
        status: data.status,
      },
      create: {
        id: data.id,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        progress: data.progress,
        status: data.status,
        projectId: projectId,
      },
    });
  }

  async findById(id: string): Promise<Task | null> {
    const taskData = await prisma.task.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!taskData) return null;

    const assignees = taskData.assignments.map(
      (a) =>
        new User({
          id: a.user.id,
          name: a.user.name,
          email: a.user.email,
          password: a.user.password,
        })
    );

    return new Task({
      id: taskData.id,
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      progress: taskData.progress,
      status: taskData.status,
      assignees,
    });
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    return tasks.map((t) => {
      const assignees = t.assignments.map(
        (a) =>
          new User({
            id: a.user.id,
            name: a.user.name,
            email: a.user.email,
            password: a.user.password,
          })
      );

      return new Task({
        id: t.id,
        title: t.title,
        description: t.description,
        deadline: t.deadline,
        progress: t.progress,
        status: t.status,
        assignees,
      });
    });
  }

  async addAssignment(taskId: string, userId: string): Promise<void> {
    await prisma.assignment.create({
      data: {
        taskId,
        userId,
      },
    });
  }

  async removeAssignment(taskId: string, userId: string): Promise<void> {
    await prisma.assignment.deleteMany({
      where: {
        taskId,
        userId,
      },
    });
  }

  async findAll(): Promise<Task[]> {
    const tasks = await prisma.task.findMany({
      include: {
        assignments: {
          include: {
            user: true,
          },
        },
      },
    });

    return tasks.map((t) => {
      const assignees = t.assignments.map(
        (a) =>
          new User({
            id: a.user.id,
            name: a.user.name,
            email: a.user.email,
            password: a.user.password,
          })
      );

      return new Task({
        id: t.id,
        title: t.title,
        description: t.description,
        deadline: t.deadline,
        progress: t.progress,
        status: t.status,
        assignees,
      });
    });
  }

  async update(
    taskId: string,
    data: { title?: string; description?: string; deadline?: Date | string; status?: string }
  ): Promise<void> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.deadline) updateData.deadline = new Date(data.deadline);
    if (data.status) updateData.status = data.status;

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async delete(taskId: string): Promise<void> {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  async addSubtask(taskId: string, subtaskId: string, title: string): Promise<void> {
    await prisma.subtask.create({
      data: {
        id: subtaskId,
        taskId,
        title,
        progress: 0,
        status: 'Pending',
      },
    });
  }

  async updateSubtask(
    subtaskId: string,
    data: { progress?: number; status?: string; title?: string }
  ): Promise<void> {
    const updateData: any = {};
    if (data.progress !== undefined) updateData.progress = data.progress;
    if (data.status) updateData.status = data.status;
    if (data.title) updateData.title = data.title;

    await prisma.subtask.update({
      where: { id: subtaskId },
      data: updateData,
    });
  }

  async getSubtasks(taskId: string): Promise<any[]> {
    return await prisma.subtask.findMany({
      where: { taskId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async deleteSubtask(subtaskId: string): Promise<void> {
    await prisma.subtask.delete({
      where: { id: subtaskId },
    });
  }

  async addComment(taskId: string, userId: string, commentId: string, content: string): Promise<void> {
    await prisma.comment.create({
      data: {
        id: commentId,
        taskId,
        userId,
        content,
      },
    });
  }

  async getComments(taskId: string): Promise<any[]> {
    return await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
