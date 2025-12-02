// API Route: Update Task Progress
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { progress } = body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return NextResponse.json(
        { error: 'Invalid progress value' },
        { status: 400 }
      );
    }

    const taskService = new TaskService();
    await taskService.updateProgress(params.id, progress);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update progress API:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
