// API Route: Upload File to Task
import { NextRequest, NextResponse } from 'next/server';
import { TaskService } from '@/lib/application/services/TaskService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing file or userId' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const taskService = new TaskService();
    
    const fileAttachment = await taskService.attachFile(
      params.id,
      userId,
      buffer,
      file.name,
      file.type,
      BigInt(file.size)
    );

    return NextResponse.json(fileAttachment.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error in upload file API:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskService = new TaskService();
    const files = await taskService.getTaskFiles(params.id);

    return NextResponse.json(files.map(f => f.toObject()));
  } catch (error) {
    console.error('Error in get files API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}
