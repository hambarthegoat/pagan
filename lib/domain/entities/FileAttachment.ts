// Domain Entity: FileAttachment
export class FileAttachment {
  private id: string;
  private fileName: string;
  private fileType: string;
  private fileSize: bigint;
  private uploadedAt: Date;
  private filePath: string;

  constructor(data: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: bigint;
    filePath: string;
    uploadedAt?: Date;
  }) {
    this.id = data.id;
    this.fileName = data.fileName;
    this.fileType = data.fileType;
    this.fileSize = data.fileSize;
    this.filePath = data.filePath;
    this.uploadedAt = data.uploadedAt || new Date();
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getFileName(): string {
    return this.fileName;
  }

  getFileType(): string {
    return this.fileType;
  }

  getFileSize(): bigint {
    return this.fileSize;
  }

  getFilePath(): string {
    return this.filePath;
  }

  getUploadedAt(): Date {
    return this.uploadedAt;
  }

  // Business methods
  upload(): void {
    // Upload logic handled by infrastructure layer
  }

  delete(): void {
    // Mark for deletion - actual deletion handled by repository
  }

  toObject() {
    return {
      id: this.id,
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      filePath: this.filePath,
      uploadedAt: this.uploadedAt,
    };
  }
}
