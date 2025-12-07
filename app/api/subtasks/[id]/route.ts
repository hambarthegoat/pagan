// API Route: Update and Delete Subtask
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { progress, status, title } = body;

    const taskService = new TaskService();

    if (progress !== undefined) {
      await taskService.updateSubtaskProgress(id, progress);
    } else {
      // Update other fields if needed
      await taskService.updateSubtaskProgress(id, progress || 0);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating subtask:', error);
    return NextResponse.json(
      { error: 'Failed to update subtask' },
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
    await taskService.deleteSubtask(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subtask:', error);
    return NextResponse.json(
      { error: 'Failed to delete subtask' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { complete } = body;

    if (complete) {
      const taskService = new TaskService();
      await taskService.completeSubtask(id);
      return NextResponse.json({ success: true, message: 'Subtask completed' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error completing subtask:', error);
    return NextResponse.json(
      { error: 'Failed to complete subtask' },
      { status: 500 }
    );
  }
}
