import { useState } from 'react';

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD',
    role: {
      id: '1',
      roleName: 'Project Manager',
      permissions: ['create_project', 'edit_project', 'delete_project', 'assign_tasks', 'manage_members']
    },
    joinedAt: '2023-06-15',
    projects: 8,
    tasksCompleted: 156,
    tasksInProgress: 24
  };

  const activityLog = [
    { id: '1', action: 'Completed task', target: 'Setup authentication flow', timestamp: '2024-02-25T10:30:00' },
    { id: '2', action: 'Commented on', target: 'Design landing page', timestamp: '2024-02-24T16:45:00' },
    { id: '3', action: 'Created project', target: 'Marketing Campaign', timestamp: '2024-02-23T09:15:00' },
    { id: '4', action: 'Assigned task to', target: 'Jane Smith - Implement responsive navigation', timestamp: '2024-02-22T14:20:00' },
    { id: '5', action: 'Uploaded file to', target: 'Backend API - API documentation', timestamp: '2024-02-21T11:00:00' }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: 0, marginBottom: '8px', fontSize: '28px', color: '#333' }}>User Profile</h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage your profile and view your activity</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '24px'
      }}>
        {/* Left Column - Profile Info */}
        <div>
          {/* Profile Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                {user.avatar}
              </div>
              <button
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                  border: '1px solid #1976d2',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Change Photo
              </button>
            </div>

            {isEditing ? (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
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
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <h3 style={{ margin: 0, marginBottom: '4px', fontSize: '20px', color: '#333' }}>
                    {user.name}
                  </h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px', marginBottom: '4px' }}>
                    {user.email}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}>
                    {user.role.roleName}
                  </span>
                </div>

                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Member since</div>
                  <div style={{ fontSize: '14px', color: '#333' }}>
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: 0, marginBottom: '16px', fontSize: '16px', color: '#333' }}>Statistics</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Projects</div>
                  <div style={{ fontSize: '24px', color: '#333' }}>{user.projects}</div>
                </div>
                <div style={{ fontSize: '32px' }}>📁</div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Completed Tasks</div>
                  <div style={{ fontSize: '24px', color: '#2e7d32' }}>{user.tasksCompleted}</div>
                </div>
                <div style={{ fontSize: '32px' }}>✓</div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>In Progress</div>
                  <div style={{ fontSize: '24px', color: '#1976d2' }}>{user.tasksInProgress}</div>
                </div>
                <div style={{ fontSize: '32px' }}>⏳</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Role & Activity */}
        <div>
          {/* Role & Permissions */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: 0, marginBottom: '16px', fontSize: '18px', color: '#333' }}>
              Role & Permissions
            </h3>

            <div style={{
              padding: '16px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  👤
                </div>
                <div>
                  <div style={{ fontSize: '16px', color: '#333', marginBottom: '2px' }}>
                    {user.role.roleName}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {user.role.permissions.length} permissions
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px', fontSize: '14px', color: '#666' }}>Permissions:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user.role.permissions.map((permission, index) => (
                <span
                  key={index}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f8f9fa',
                    color: '#333',
                    borderRadius: '6px',
                    fontSize: '13px',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  {permission.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: 0, marginBottom: '16px', fontSize: '18px', color: '#333' }}>
              Recent Activity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activityLog.map(activity => (
                <div
                  key={activity.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    borderLeft: '3px solid #1976d2'
                  }}
                >
                  <div style={{ fontSize: '14px', color: '#333', marginBottom: '4px' }}>
                    <span style={{ color: '#666' }}>{activity.action}</span>
                    {' '}
                    <span>{activity.target}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>

            <button
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#1976d2',
                border: '1px solid #1976d2',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                marginTop: '16px'
              }}
            >
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
