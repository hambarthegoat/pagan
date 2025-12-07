// API Route: Update and Delete Task
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskService = new TaskService();
    const task = await taskService.getTask(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task.toObject());
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { progress, status, title, description, deadline } = body;

    const taskService = new TaskService();
    
    if (progress !== undefined) {
      await taskService.updateProgress(id, progress);
    }

    if (status !== undefined || title !== undefined || description !== undefined || deadline !== undefined) {
      await taskService.updateTask(id, { title, description, deadline, status });
    }

    const updatedTask = await taskService.getTask(id);
    return NextResponse.json(updatedTask?.toObject());
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskService = new TaskService();
    await taskService.deleteTask(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
