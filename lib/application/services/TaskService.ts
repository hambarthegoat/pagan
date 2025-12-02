// Application Layer: Task Service (following Sequence Diagrams 2 & 3)
import { v4 as uuidv4 } from 'uuid';
import { Task } from '@/lib/domain/entities/Task';
import { User } from '@/lib/domain/entities/User';
import { FileAttachment } from '@/lib/domain/entities/FileAttachment';
import { TaskRepository } from '@/lib/infrastructure/repositories/TaskRepository';
import { UserRepository } from '@/lib/infrastructure/repositories/UserRepository';
import { NotificationService } from '@/lib/infrastructure/services/NotificationService';
import { EmailService } from '@/lib/infrastructure/services/EmailService';
import { FileStorageService } from '@/lib/infrastructure/services/FileStorageService';
import { NotificationSubject } from '@/lib/domain/patterns/Observer';
import { StatusContext, DefaultStatusStrategy } from '@/lib/domain/patterns/Strategy';

export interface CreateTaskData {
  title: string;
  description: string;
  projectId: string;
  deadline?: Date;
  assigneeIds?: string[];
  priority?: string;
}

export class TaskService {
  private taskRepository: TaskRepository;
  private userRepository: UserRepository;
  private notificationService: NotificationService;
  private emailService: EmailService;
  private fileStorageService: FileStorageService;
  private notificationSubject: NotificationSubject;
  private statusContext: StatusContext;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.userRepository = new UserRepository();
    this.notificationService = new NotificationService();
    this.emailService = new EmailService();
    this.fileStorageService = new FileStorageService();
    this.notificationSubject = new NotificationSubject();
    
    // Attach observers
    this.notificationSubject.attach(this.notificationService);
    this.notificationSubject.attach(this.emailService);
    
    // Initialize Strategy pattern for status management
    this.statusContext = new StatusContext(new DefaultStatusStrategy());
  }

  // Following Sequence Diagram 2: Create Task + setDeadline() + addAssignee()
  async createTask(data: CreateTaskData): Promise<{ success: boolean; taskId: string }> {
    try {
      // Instantiate Task (Domain)
      const taskId = uuidv4();
      const task = new Task({
        id: taskId,
        title: data.title,
        description: data.description,
        status: 'Pending',
      });

      // Set deadline if provided
      if (data.deadline) {
        task.setDeadline(data.deadline);
      }

      // Add assignees if provided
      const assignees: User[] = [];
      if (data.assigneeIds && data.assigneeIds.length > 0) {
        for (const memberId of data.assigneeIds) {
          const user = await this.userRepository.findById(memberId);
          if (user) {
            task.addAssignee(user);
            assignees.push(user);
          }
        }
      }

      // Save task (Infrastructure)
      await this.taskRepository.save(task, data.projectId);

      // Save assignments
      if (assignees.length > 0) {
        for (const assignee of assignees) {
          await this.taskRepository.addAssignment(taskId, assignee.getId());
        }

        // Notify assignees via Observer pattern
        this.notificationSubject.notify({
          type: 'task_assigned',
          task: {
            id: taskId,
            title: data.title,
            assignees: assignees.map(a => ({
              id: a.getId(),
              email: a.getEmail(),
              name: a.getName(),
            })),
          },
        });
      }

      return { success: true, taskId };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Following Sequence Diagram 3: View Task
  async getTask(taskId: string): Promise<Task | null> {
    return await this.taskRepository.findById(taskId);
  }

  // Following Sequence Diagram 3: Update Progress
  async updateProgress(taskId: string, value: number): Promise<void> {
    try {
      // Find task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Update progress using domain logic
      task.updateProgress(value);

      // Use Strategy pattern to update status
      const newStatus = this.statusContext.executeStrategy(value);
      task.changeStatus(newStatus);

      // Save updated task
      await this.taskRepository.save(task, ''); // projectId not needed for update

      // Notify observers about task update
      this.notificationSubject.notify({
        type: 'task_updated',
        task: {
          id: taskId,
          title: task.getTitle(),
          progress: value,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  // Following Sequence Diagram 3: Upload File
  async attachFile(
    taskId: string,
    userId: string,
    file: Buffer,
    fileName: string,
    fileType: string,
    fileSize: bigint
  ): Promise<FileAttachment> {
    try {
      // Find task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      // Upload file to storage
      const filePath = await this.fileStorageService.upload(file, fileName, fileType);

      // Instantiate FileAttachment (Domain)
      const fileAttachment = await this.fileStorageService.saveFileAttachment(
        taskId,
        userId,
        filePath,
        fileName,
        fileType,
        fileSize
      );

      return fileAttachment;
    } catch (error) {
      console.error('Error attaching file:', error);
      throw error;
    }
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return await this.taskRepository.findByProjectId(projectId);
  }

  async getAllTasks(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async getTaskFiles(taskId: string): Promise<FileAttachment[]> {
    return await this.fileStorageService.getFilesByTaskId(taskId);
  }
}
