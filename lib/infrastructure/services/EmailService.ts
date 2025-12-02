// Infrastructure Layer: Email Service
import { Observer } from '@/lib/domain/patterns/Observer';

export class EmailService implements Observer {
  async sendInvitations(emails: string[]): Promise<void> {
    console.log('📧 Sending invitations to:', emails);
    
    // In production, integrate with actual email service (SendGrid, AWS SES, etc.)
    for (const email of emails) {
      await this.sendEmail(email, 'Project Invitation', 'You have been invited to join a project');
    }
  }

  async notifyAssignees(taskData: any): Promise<void> {
    console.log('📧 Notifying assignees:', taskData);
    
    // Send email notifications to assignees
    if (taskData.assignees && taskData.assignees.length > 0) {
      for (const assignee of taskData.assignees) {
        await this.sendEmail(
          assignee.email,
          'New Task Assignment',
          `You have been assigned to task: ${taskData.title}`
        );
      }
    }
  }

  // Observer pattern update method
  update(data: any): void {
    console.log('📧 Email Observer received notification:', data);
    
    if (data.type === 'task_assigned') {
      this.notifyAssignees(data.task);
    } else if (data.type === 'project_invitation') {
      this.sendInvitations(data.emails);
    }
  }

  private async sendEmail(to: string, subject: string, body: string): Promise<void> {
    // Mock email sending - in production, use actual email service
    console.log(`Sending email to ${to}: ${subject}`);
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
