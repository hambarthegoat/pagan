'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { ProjectsPage } from '@/components/ProjectsPage';
import { ProjectDetail } from '@/components/ProjectDetail';
import { TaskDetail } from '@/components/TaskDetail';
import { UserProfile } from '@/components/UserProfile';
import { Navigation } from '@/components/Navigation';

export type Page = 'dashboard' | 'projects' | 'project-detail' | 'task-detail' | 'profile';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const navigateTo = (page: Page, projectId?: string, taskId?: string) => {
    setCurrentPage(page);
    if (projectId) setSelectedProjectId(projectId);
    if (taskId) setSelectedTaskId(taskId);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation currentPage={currentPage} onNavigate={navigateTo} />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {currentPage === 'dashboard' && <Dashboard onNavigate={navigateTo} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={navigateTo} />}
        {currentPage === 'project-detail' && selectedProjectId && (
          <ProjectDetail projectId={selectedProjectId} onNavigate={navigateTo} />
        )}
        {currentPage === 'task-detail' && selectedTaskId && (
          <TaskDetail taskId={selectedTaskId} onNavigate={navigateTo} />
        )}
        {currentPage === 'profile' && <UserProfile />}
      </main>
    </div>
  );
}

