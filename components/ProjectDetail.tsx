import { Page } from '../app/page';
import { useState } from 'react';

interface ProjectDetailProps {
  projectId: string;
  onNavigate: (page: Page, projectId?: string, taskId?: string) => void;
}

export function ProjectDetail({ projectId, onNavigate }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'members'>('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const project = {
    id: projectId,
    name: 'Website Redesign',
    description: 'Complete redesign of company website with modern UI/UX',
    progress: 75,
    createdAt: '2024-01-15',
    deadline: '2024-03-30',
    members: [
      { id: '1', name: 'John Doe', avatar: 'JD', role: 'Project Manager', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', avatar: 'JS', role: 'UI/UX Designer', email: 'jane@example.com' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ', role: 'Frontend Developer', email: 'mike@example.com' },
      { id: '4', name: 'Sarah Williams', avatar: 'SW', role: 'Backend Developer', email: 'sarah@example.com' },
      { id: '5', name: 'Tom Brown', avatar: 'TB', role: 'QA Engineer', email: 'tom@example.com' }
    ],
    tasks: [
      {
        id: '1',
        title: 'Design landing page',
        description: 'Create mockups for the new landing page',
        status: 'In Progress',
        priority: 'High',
        progress: 65,
        assignees: [
          { id: '2', name: 'Jane Smith', avatar: 'JS' }
        ],
        deadline: '2024-03-15',
        subtasks: 3,
        comments: 5,
        attachments: 2
      },
      {
        id: '2',
        title: 'Implement responsive navigation',
        description: 'Build responsive navigation component',
        status: 'In Progress',
        priority: 'High',
        progress: 80,
        assignees: [
          { id: '3', name: 'Mike Johnson', avatar: 'MJ' }
        ],
        deadline: '2024-03-10',
        subtasks: 2,
        comments: 8,
        attachments: 1
      },
      {
        id: '3',
        title: 'Setup authentication flow',
        description: 'Implement user authentication and authorization',
        status: 'Completed',
        priority: 'High',
        progress: 100,
        assignees: [
          { id: '4', name: 'Sarah Williams', avatar: 'SW' }
        ],
        deadline: '2024-03-05',
        subtasks: 4,
        comments: 12,
        attachments: 3
      },
      {
        id: '4',
        title: 'Write user documentation',
        description: 'Create comprehensive user guides',
        status: 'Pending',
        priority: 'Medium',
        progress: 0,
        assignees: [
          { id: '1', name: 'John Doe', avatar: 'JD' }
        ],
        deadline: '2024-03-25',
        subtasks: 5,
        comments: 2,
        attachments: 0
      },
      {
        id: '5',
        title: 'Performance optimization',
        description: 'Optimize page load times and performance',
        status: 'Pending',
        priority: 'Medium',
        progress: 20,
        assignees: [
          { id: '3', name: 'Mike Johnson', avatar: 'MJ' }
        ],
        deadline: '2024-03-20',
        subtasks: 3,
        comments: 4,
        attachments: 0
      },
      {
        id: '6',
        title: 'Browser compatibility testing',
        description: 'Test on all major browsers',
        status: 'Pending',
        priority: 'Low',
        progress: 0,
        assignees: [
          { id: '5', name: 'Tom Brown', avatar: 'TB' }
        ],
        deadline: '2024-03-28',
        subtasks: 6,
        comments: 1,
        attachments: 0
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return '#1976d2';
      case 'Pending': return '#ed6c02';
      case 'Completed': return '#2e7d32';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#d32f2f';
      case 'Medium': return '#ed6c02';
      case 'Low': return '#2e7d32';
      default: return '#666';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <button
          onClick={() => onNavigate('projects')}
          style={{
            padding: '8px 16px',
            backgroundColor: 'transparent',
            color: '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>←</span> Back to Projects
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '32px', color: '#333' }}>
              {project.name}
            </h2>
            <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '16px' }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#666' }}>
              <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>
              <span>⏰ Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              <span>👥 {project.members.length} members</span>
            </div>
          </div>

          <button
            onClick={() => setShowCreateTask(true)}
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
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Add Task
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Overall Progress</span>
            <span style={{ fontSize: '14px', color: '#333' }}>{project.progress}%</span>
          </div>
          <div style={{
            height: '12px',
            backgroundColor: '#e0e0e0',
            borderRadius: '6px',
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
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'tasks' ? '#1976d2' : '#666',
              border: 'none',
              borderBottom: activeTab === 'tasks' ? '2px solid #1976d2' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '-2px'
            }}
          >
            Tasks ({project.tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'members' ? '#1976d2' : '#666',
              border: 'none',
              borderBottom: activeTab === 'members' ? '2px solid #1976d2' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '-2px'
            }}
          >
            Members ({project.members.length})
          </button>
        </div>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {project.tasks.map(task => (
            <div
              key={task.id}
              onClick={() => onNavigate('task-detail', undefined, task.id)}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{task.title}</h3>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: `${getPriorityColor(task.priority)}15`,
                      color: getPriorityColor(task.priority),
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {task.priority}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: `${getStatusColor(task.status)}15`,
                      color: getStatusColor(task.status),
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {task.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{task.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                  {task.assignees.map(assignee => (
                    <div
                      key={assignee.id}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px'
                      }}
                      title={assignee.name}
                    >
                      {assignee.avatar}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ flex: 1, marginRight: '16px' }}>
                  <div style={{
                    height: '6px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${task.progress}%`,
                      backgroundColor: getStatusColor(task.status)
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: '13px', color: '#666' }}>{task.progress}%</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#666' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span>📋 {task.subtasks} subtasks</span>
                  <span>💬 {task.comments} comments</span>
                  <span>📎 {task.attachments} files</span>
                </div>
                <span>⏰ Due: {new Date(task.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}>
          {project.members.map(member => (
            <div
              key={member.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0
              }}>
                {member.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', color: '#333', marginBottom: '4px' }}>
                  {member.name}
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                  {member.role}
                </div>
                <div style={{ fontSize: '12px', color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {member.email}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowAddMember(true)}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '2px dashed #e0e0e0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '96px',
              color: '#1976d2',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1976d2';
              e.currentTarget.style.backgroundColor = '#e3f2fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            <span style={{ fontSize: '24px' }}>+</span>
            Add Member
          </button>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTask && (
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
          onClick={() => setShowCreateTask(false)}
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
              Create New Task
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                Task Title
              </label>
              <input
                type="text"
                placeholder="Enter task title"
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
                placeholder="Enter task description"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minHeight: '80px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                  Priority
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white'
                  }}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
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
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateTask(false)}
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
                onClick={() => setShowCreateTask(false)}
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
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
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
          onClick={() => setShowAddMember(false)}
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
              Add New Member
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                Name
              </label>
              <input
                type="text"
                placeholder="Enter member name"
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
                Email
              </label>
              <input
                type="email"
                placeholder="Enter member email"
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
                Role
              </label>
              <input
                type="text"
                placeholder="Enter member role"
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
                onClick={() => setShowAddMember(false)}
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
                onClick={() => setShowAddMember(false)}
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
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}