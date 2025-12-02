import { Page } from '../app/page';

interface DashboardProps {
  onNavigate: (page: Page, projectId?: string, taskId?: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: 'Total Projects', value: '8', icon: '📁', color: '#1976d2' },
    { label: 'Active Tasks', value: '24', icon: '✓', color: '#2e7d32' },
    { label: 'Pending Tasks', value: '12', icon: '⏳', color: '#ed6c02' },
    { label: 'Completed', value: '156', icon: '✔', color: '#9c27b0' },
  ];

  const recentTasks = [
    { id: '1', title: 'Design landing page', project: 'Website Redesign', priority: 'High', status: 'In Progress', progress: 65 },
    { id: '2', title: 'Implement authentication', project: 'Mobile App', priority: 'High', status: 'In Progress', progress: 40 },
    { id: '3', title: 'Write API documentation', project: 'Backend API', priority: 'Medium', status: 'Pending', progress: 20 },
    { id: '4', title: 'User testing', project: 'Website Redesign', priority: 'Low', status: 'Pending', progress: 0 },
  ];

  const activeProjects = [
    { id: '1', name: 'Website Redesign', progress: 75, tasks: 12, members: 5 },
    { id: '2', name: 'Mobile App', progress: 45, tasks: 18, members: 8 },
    { id: '3', name: 'Backend API', progress: 60, tasks: 8, members: 4 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#ed6c02';
      case 'Low': return '#2e7d32';
      default: return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return '#1976d2';
      case 'Pending': return '#ed6c02';
      case 'Completed': return '#2e7d32';
      default: return '#666';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '28px', color: '#333' }}>Dashboard</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Welcome back! Here's your overview</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', color: '#333' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Active Projects */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Active Projects</h3>
            <button
              onClick={() => onNavigate('projects')}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeProjects.map(project => (
              <div
                key={project.id}
                onClick={() => onNavigate('project-detail', project.id)}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '15px', color: '#333' }}>{project.name}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{project.progress}%</span>
                </div>
                <div style={{
                  height: '6px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${project.progress}%`,
                    backgroundColor: '#1976d2',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#666' }}>
                  <span>📋 {project.tasks} tasks</span>
                  <span>👥 {project.members} members</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>Recent Tasks</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTasks.map(task => (
              <div
                key={task.id}
                onClick={() => onNavigate('task-detail', undefined, task.id)}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e3f2fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '15px', color: '#333', marginBottom: '4px' }}>{task.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{task.project}</div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: `${getPriorityColor(task.priority)}15`,
                    color: getPriorityColor(task.priority),
                    borderRadius: '4px',
                    fontSize: '11px'
                  }}>
                    {task.priority}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${task.progress}%`,
                      backgroundColor: getStatusColor(task.status)
                    }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: getStatusColor(task.status)
                  }}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
