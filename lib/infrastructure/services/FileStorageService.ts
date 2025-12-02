// Infrastructure Layer: File Storage Service
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { FileAttachment } from '@/lib/domain/entities/FileAttachment';
import { prisma } from '../database/prisma';

export class FileStorageService {
  private uploadDir = join(process.cwd(), 'public', 'uploads');

  async upload(file: Buffer, fileName: string, fileType: string): Promise<string> {
    const timestamp = Date.now();
    const safeName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `/uploads/${safeName}`;
    const fullPath = join(this.uploadDir, safeName);

    // In production, upload to cloud storage (S3, Azure Blob, etc.)
    await writeFile(fullPath, file);
    
    return filePath;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = join(process.cwd(), 'public', filePath);
    
    try {
      await unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async saveFileAttachment(
    taskId: string,
    userId: string,
    filePath: string,
    fileName: string,
    fileType: string,
    fileSize: bigint
  ): Promise<FileAttachment> {
    const fileData = await prisma.fileAttachment.create({
      data: {
        fileName,
        fileType,
        fileSize,
        filePath,
        taskId,
        userId,
      },
    });

    return new FileAttachment({
      id: fileData.id,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      filePath: fileData.filePath,
      uploadedAt: fileData.uploadedAt,
    });
  }

  async getFilesByTaskId(taskId: string): Promise<FileAttachment[]> {
    const files = await prisma.fileAttachment.findMany({
      where: { taskId },
    });

    return files.map(
      (f) =>
        new FileAttachment({
          id: f.id,
          fileName: f.fileName,
          fileType: f.fileType,
          fileSize: f.fileSize,
          filePath: f.filePath,
          uploadedAt: f.uploadedAt,
        })
    );
  }
}
