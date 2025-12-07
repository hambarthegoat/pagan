// API Route: Subtasks
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, title } = body;

    if (!taskId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const taskService = new TaskService();
    const result = await taskService.addSubtask(taskId, title);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to create subtask' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId is required' },
        { status: 400 }
      );
    }

    const taskService = new TaskService();
    const subtasks = await taskService.getSubtasks(taskId);

    return NextResponse.json(subtasks);
  } catch (error) {
    console.error('Error fetching subtasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subtasks' },
      { status: 500 }
    );
  }
}
