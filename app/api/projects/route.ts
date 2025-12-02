// API Route: Create Project
import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/application/services/ProjectService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, description, creatorId, memberEmails } = body;

    if (!projectName || !description || !creatorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const projectService = new ProjectService();
    const result = await projectService.createProject({
      projectName,
      description,
      creatorId,
      memberEmails,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in create project API:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    const userId = searchParams.get('userId');

    const projectService = new ProjectService();

    if (projectId) {
      const project = await projectService.getProject(projectId);
      if (!project) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(project.toObject());
    }

    if (userId) {
      const projects = await projectService.getUserProjects(userId);
      return NextResponse.json(projects.map(p => p.toObject()));
    }

    const projects = await projectService.getAllProjects();
    return NextResponse.json(projects.map(p => p.toObject()));
  } catch (error) {
    console.error('Error in get projects API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
