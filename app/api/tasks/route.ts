// API Route: Create and Get Tasks
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, projectId, deadline, assigneeIds, priority } = body;

    if (!title || !description || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const taskService = new TaskService();
    const result = await taskService.createTask({
      title,
      description,
      projectId,
      deadline: deadline ? new Date(deadline) : undefined,
      assigneeIds,
      priority,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in create task API:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('id');
    const projectId = searchParams.get('projectId');

    const taskService = new TaskService();

    if (taskId) {
      const task = await taskService.getTask(taskId);
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(task.toObject());
    }

    if (projectId) {
      const tasks = await taskService.getTasksByProject(projectId);
      return NextResponse.json(tasks.map(t => t.toObject()));
    }

    const tasks = await taskService.getAllTasks();
    return NextResponse.json(tasks.map(t => t.toObject()));
  } catch (error) {
    console.error('Error in get tasks API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}
