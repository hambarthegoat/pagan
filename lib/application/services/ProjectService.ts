// Application Layer: Project Service (following Sequence Diagram 1)
import { v4 as uuidv4 } from 'uuid';
import { Project } from '@/lib/domain/entities/Project';
import { User } from '@/lib/domain/entities/User';
import { ProjectRepository } from '@/lib/infrastructure/repositories/ProjectRepository';
import { UserRepository } from '@/lib/infrastructure/repositories/UserRepository';
import { EmailService } from '@/lib/infrastructure/services/EmailService';
import { NotificationSubject } from '@/lib/domain/patterns/Observer';

export interface CreateProjectData {
  projectName: string;
  description: string;
  creatorId: string;
  memberEmails?: string[];
}

export class ProjectService {
  private projectRepository: ProjectRepository;
  private userRepository: UserRepository;
  private emailService: EmailService;
  private notificationSubject: NotificationSubject;

  constructor() {
    this.projectRepository = new ProjectRepository();
    this.userRepository = new UserRepository();
    this.emailService = new EmailService();
    this.notificationSubject = new NotificationSubject();
    
    // Attach email service as observer
    this.notificationSubject.attach(this.emailService);
  }

  // Following Sequence Diagram 1: Create Project & Invite Members
  async createProject(data: CreateProjectData): Promise<{ success: boolean; projectId: string }> {
    try {
      // Instantiate Project (Domain)
      const projectId = uuidv4();
      const project = new Project({
        id: projectId,
        projectName: data.projectName,
        description: data.description,
      });

      // Get leader/creator user
      const leader = await this.userRepository.findById(data.creatorId);
      if (!leader) {
        throw new Error('Creator not found');
      }

      // Add leader as member
      project.addMember(leader);

      // Save project (Infrastructure)
      await this.projectRepository.save(project, data.creatorId);
      
      // Add leader to project members
      await this.projectRepository.addMember(projectId, data.creatorId);

      // Invite members if provided
      if (data.memberEmails && data.memberEmails.length > 0) {
        await this.inviteMembers(projectId, data.memberEmails);
      }

      return { success: true, projectId };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async inviteMembers(projectId: string, emailList: string[]): Promise<void> {
    // Validate users
    const validEmails: string[] = [];
    
    for (const email of emailList) {
      const isValid = await this.userRepository.validateUser(email);
      if (isValid) {
        validEmails.push(email);
        
        // Get user and add to project
        const user = await this.userRepository.findByEmail(email);
        if (user) {
          await this.projectRepository.addMember(projectId, user.getId());
        }
      }
    }

    // Send invitations via Observer pattern
    if (validEmails.length > 0) {
      this.notificationSubject.notify({
        type: 'project_invitation',
        emails: validEmails,
        projectId,
      });
    }
  }

  async getProject(projectId: string): Promise<Project | null> {
    return await this.projectRepository.findById(projectId);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    return await this.projectRepository.findByCreatorId(userId);
  }

  async getAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }
}
