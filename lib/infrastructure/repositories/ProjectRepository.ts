// Infrastructure Layer: Project Repository
import { prisma } from '../database/prisma';
import { Project } from '@/lib/domain/entities/Project';
import { User } from '@/lib/domain/entities/User';

export class ProjectRepository {
  async save(project: Project, creatorId: string): Promise<void> {
    const data = project.toObject();
    
    await prisma.project.upsert({
      where: { id: data.id },
      update: {
        projectName: data.projectName,
        description: data.description,
      },
      create: {
        id: data.id,
        projectName: data.projectName,
        description: data.description,
        creatorId: creatorId,
      },
    });
  }

  async findById(id: string): Promise<Project | null> {
    const projectData = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!projectData) return null;

    const members = projectData.members.map(
      (m) =>
        new User({
          id: m.user.id,
          name: m.user.name,
          email: m.user.email,
          password: m.user.password,
        })
    );

    return new Project({
      id: projectData.id,
      projectName: projectData.projectName,
      description: projectData.description,
      createdAt: projectData.createdAt,
      members,
    });
  }

  async findByCreatorId(creatorId: string): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      where: { creatorId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return projects.map((p) => {
      const members = p.members.map(
        (m) =>
          new User({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            password: m.user.password,
          })
      );

      return new Project({
        id: p.id,
        projectName: p.projectName,
        description: p.description,
        createdAt: p.createdAt,
        members,
      });
    });
  }

  async addMember(projectId: string, userId: string): Promise<void> {
    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await prisma.projectMember.deleteMany({
      where: {
        projectId,
        userId,
      },
    });
  }

  async findAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    return projects.map((p) => {
      const members = p.members.map(
        (m) =>
          new User({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            password: m.user.password,
          })
      );

      return new Project({
        id: p.id,
        projectName: p.projectName,
        description: p.description,
        createdAt: p.createdAt,
        members,
      });
    });
  }

  async update(
    projectId: string,
    data: { projectName?: string; description?: string }
  ): Promise<void> {
    const updateData: any = {};
    if (data.projectName) updateData.projectName = data.projectName;
    if (data.description) updateData.description = data.description;

    await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });
  }

  async delete(projectId: string): Promise<void> {
    await prisma.project.delete({
      where: { id: projectId },
    });
  }
}
