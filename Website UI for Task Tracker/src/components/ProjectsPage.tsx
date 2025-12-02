import { Page } from '../App';
import { useState } from 'react';

interface ProjectsPageProps {
  onNavigate: (page: Page, projectId?: string) => void;
}

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const projects = [
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete redesign of company website with modern UI/UX',
      progress: 75,
      tasks: { total: 12, completed: 9, inProgress: 2, pending: 1 },
      members: [
        { id: '1', name: 'John Doe', avatar: 'JD' },
        { id: '2', name: 'Jane Smith', avatar: 'JS' },
        { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
        { id: '4', name: 'Sarah Williams', avatar: 'SW' },
        { id: '5', name: 'Tom Brown', avatar: 'TB' }
      ],
      createdAt: '2024-01-15',
      deadline: '2024-03-30'
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application for iOS and Android',
      progress: 45,
      tasks: { total: 18, completed: 6, inProgress: 5, pending: 7 },
      members: [
        { id: '1', name: 'John Doe', avatar: 'JD' },
        { id: '6', name: 'Emily Davis', avatar: 'ED' },
        { id: '7', name: 'Chris Wilson', avatar: 'CW' },
        { id: '8', name: 'Lisa Anderson', avatar: 'LA' }
      ],
      createdAt: '2024-02-01',
      deadline: '2024-05-15'
    },
    {
      id: '3',
      name: 'Backend API',
      description: 'RESTful API development with authentication and authorization',
      progress: 60,
      tasks: { total: 8, completed: 4, inProgress: 3, pending: 1 },
      members: [
        { id: '1', name: 'John Doe', avatar: 'JD' },
        { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
        { id: '9', name: 'David Lee', avatar: 'DL' }
      ],
      createdAt: '2024-01-20',
      deadline: '2024-04-10'
    },
    {
      id: '4',
      name: 'Marketing Campaign',
      description: 'Q1 2024 digital marketing campaign planning and execution',
      progress: 30,
      tasks: { total: 15, completed: 3, inProgress: 4, pending: 8 },
      members: [
        { id: '10', name: 'Anna Taylor', avatar: 'AT' },
        { id: '11', name: 'Mark Roberts', avatar: 'MR' }
      ],
      createdAt: '2024-02-10',
      deadline: '2024-03-31'
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '28px', color: '#333' }}>Projects</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage all your projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Create Project
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => onNavigate('project-detail', project.id)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              e.currentTarget.style.borderColor = '#1976d2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '20px', color: '#333' }}>
                {project.name}
              </h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                {project.description}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#666' }}>Progress</span>
                <span style={{ fontSize: '13px', color: '#333' }}>{project.progress}%</span>
              </div>
              <div style={{
                height: '8px',
                backgroundColor: '#e0e0e0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${project.progress}%`,
                  backgroundColor: '#1976d2',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '16px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ fontSize: '13px', color: '#666' }}>
                <span style={{ color: '#2e7d32' }}>✓ {project.tasks.completed}</span>
                {' · '}
                <span style={{ color: '#1976d2' }}>⟳ {project.tasks.inProgress}</span>
                {' · '}
                <span style={{ color: '#666' }}>⏳ {project.tasks.pending}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {project.members.slice(0, 4).map((member, index) => (
                  <div
                    key={member.id}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      border: '2px solid white',
                      marginLeft: index > 0 ? '-8px' : '0'
                    }}
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                ))}
                {project.members.length > 4 && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e0e0',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    border: '2px solid white',
                    marginLeft: '-8px'
                  }}>
                    +{project.members.length - 4}
                  </div>
                )}
              </div>

              <div style={{ fontSize: '12px', color: '#666' }}>
                Due: {new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px',
              width: '500px',
              maxWidth: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: 0, marginBottom: '24px', fontSize: '24px', color: '#333' }}>
              Create New Project
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                Project Name
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                Description
              </label>
              <textarea
                placeholder="Enter project description"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '100px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                Deadline
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
