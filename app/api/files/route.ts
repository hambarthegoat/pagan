// API Route: File Attachments
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const taskId = formData.get('taskId') as string;
    const userId = formData.get('userId') as string;
    const file = formData.get('file') as File;

    if (!taskId || !userId || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const taskService = new TaskService();
    
    const fileAttachment = await taskService.attachFile(
      taskId,
      userId,
      buffer,
      file.name,
      file.type,
      BigInt(file.size)
    );

    return NextResponse.json(fileAttachment.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
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
    const files = await taskService.getTaskFiles(taskId);

    return NextResponse.json(files.map(f => f.toObject()));
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
