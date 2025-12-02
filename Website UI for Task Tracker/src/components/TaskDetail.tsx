import { Page } from '../App';
import { useState } from 'react';

interface TaskDetailProps {
  taskId: string;
  onNavigate: (page: Page, projectId?: string, taskId?: string) => void;
}

export function TaskDetail({ taskId, onNavigate }: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState<'subtasks' | 'comments' | 'files'>('subtasks');
  const [newComment, setNewComment] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [progressValue, setProgressValue] = useState(65);

  const task = {
    id: taskId,
    title: 'Design landing page',
    description: 'Create mockups for the new landing page with modern design principles. Focus on user experience and conversion optimization.',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    project: { id: '1', name: 'Website Redesign' },
    assignees: [
      { id: '2', name: 'Jane Smith', avatar: 'JS', role: 'UI/UX Designer' },
      { id: '3', name: 'Mike Johnson', avatar: 'MJ', role: 'Frontend Developer' }
    ],
    createdAt: '2024-02-15',
    deadline: '2024-03-15',
    subtasks: [
      { id: '1', title: 'Create wireframes', status: 'Completed', progress: 100 },
      { id: '2', title: 'Design hero section', status: 'In Progress', progress: 80 },
      { id: '3', title: 'Design features section', status: 'In Progress', progress: 60 },
      { id: '4', title: 'Create responsive layouts', status: 'Pending', progress: 0 }
    ],
    comments: [
      {
        id: '1',
        user: { id: '1', name: 'John Doe', avatar: 'JD' },
        content: 'Great progress on the wireframes! Looking forward to seeing the hero section design.',
        createdAt: '2024-02-20T10:30:00',
        edited: false
      },
      {
        id: '2',
        user: { id: '2', name: 'Jane Smith', avatar: 'JS' },
        content: 'Thanks! I have uploaded the initial hero section mockup. Please review and let me know your thoughts.',
        createdAt: '2024-02-20T14:15:00',
        edited: false
      },
      {
        id: '3',
        user: { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
        content: 'The design looks amazing! I can start implementing once you finalize the responsive layouts.',
        createdAt: '2024-02-21T09:00:00',
        edited: false
      },
      {
        id: '4',
        user: { id: '1', name: 'John Doe', avatar: 'JD' },
        content: 'Approved! Lets proceed with the current design direction.',
        createdAt: '2024-02-21T16:45:00',
        edited: false
      }
    ],
    attachments: [
      {
        id: '1',
        fileName: 'landing-page-mockup-v1.fig',
        fileType: 'application/figma',
        fileSize: 2457600,
        uploadedAt: '2024-02-20T14:00:00',
        uploadedBy: { id: '2', name: 'Jane Smith', avatar: 'JS' }
      },
      {
        id: '2',
        fileName: 'design-system.pdf',
        fileType: 'application/pdf',
        fileSize: 1048576,
        uploadedAt: '2024-02-18T11:30:00',
        uploadedBy: { id: '2', name: 'Jane Smith', avatar: 'JS' }
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('figma')) return '🎨';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    return '📎';
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <button onClick={() => onNavigate('project-detail', task.project.id)} style={{ padding: '8px 16px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span> Back to {task.project.name}
        </button>

        <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <h2 style={{ margin: 0, fontSize: '32px', color: '#333' }}>{task.title}</h2>
                <span style={{ padding: '6px 12px', backgroundColor: `${getPriorityColor(task.priority)}15`, color: getPriorityColor(task.priority), borderRadius: '6px', fontSize: '13px' }}>
                  {task.priority} Priority
                </span>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '15px', lineHeight: '1.6' }}>{task.description}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Status</div>
              <span style={{ padding: '6px 12px', backgroundColor: `${getStatusColor(task.status)}15`, color: getStatusColor(task.status), borderRadius: '6px', fontSize: '13px', display: 'inline-block' }}>{task.status}</span>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${task.progress}%`, backgroundColor: getStatusColor(task.status) }} />
                </div>
                <span style={{ fontSize: '13px', color: '#333' }}>{task.progress}%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Deadline</div>
              <div style={{ fontSize: '14px', color: '#333' }}>{new Date(task.deadline).toLocaleDateString()}</div>
            </div>
            <div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Assignees</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {task.assignees.map(assignee => (
                  <div key={assignee.id} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', border: '2px solid white', marginLeft: assignee.id !== task.assignees[0].id ? '-8px' : '0' }} title={assignee.name}>
                    {assignee.avatar}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
            <button onClick={() => setShowProgressModal(true)} style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📊 Update Progress
            </button>
            <button style={{ padding: '10px 20px', backgroundColor: 'white', color: '#1976d2', border: '1px solid #1976d2', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>
              Change Status
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px', borderBottom: '2px solid #f0f0f0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveTab('subtasks')} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: activeTab === 'subtasks' ? '#1976d2' : '#666', border: 'none', borderBottom: activeTab === 'subtasks' ? '2px solid #1976d2' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', marginBottom: '-2px' }}>
            Subtasks ({task.subtasks.length})
          </button>
          <button onClick={() => setActiveTab('comments')} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: activeTab === 'comments' ? '#1976d2' : '#666', border: 'none', borderBottom: activeTab === 'comments' ? '2px solid #1976d2' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', marginBottom: '-2px' }}>
            Comments ({task.comments.length})
          </button>
          <button onClick={() => setActiveTab('files')} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: activeTab === 'files' ? '#1976d2' : '#666', border: 'none', borderBottom: activeTab === 'files' ? '2px solid #1976d2' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', marginBottom: '-2px' }}>
            Files ({task.attachments.length})
          </button>
        </div>
      </div>

      {activeTab === 'subtasks' && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Subtasks</h3>
            <button style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>+</span> Add Subtask
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {task.subtasks.map(subtask => (
              <div key={subtask.id} style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input type="checkbox" checked={subtask.status === 'Completed'} style={{ width: '20px', height: '20px', cursor: 'pointer' }} onChange={() => {}} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', color: subtask.status === 'Completed' ? '#666' : '#333', textDecoration: subtask.status === 'Completed' ? 'line-through' : 'none', marginBottom: '8px' }}>
                    {subtask.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '4px', backgroundColor: '#e0e0e0', borderRadius: '2px', overflow: 'hidden', maxWidth: '200px' }}>
                      <div style={{ height: '100%', width: `${subtask.progress}%`, backgroundColor: getStatusColor(subtask.status) }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#666' }}>{subtask.progress}%</span>
                    <span style={{ padding: '4px 8px', backgroundColor: `${getStatusColor(subtask.status)}15`, color: getStatusColor(subtask.status), borderRadius: '4px', fontSize: '11px' }}>{subtask.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '18px', color: '#333' }}>Comments</h3>
          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>JD</div>
              <div style={{ flex: 1 }}>
                <textarea placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', marginBottom: '8px' }} />
                <button style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Post Comment</button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {task.comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{comment.user.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#333', marginRight: '8px' }}>{comment.user.name}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>{formatDate(comment.createdAt)}{comment.edited && ' (edited)'}</span>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px', color: '#333', lineHeight: '1.5' }}>{comment.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Attachments</h3>
            <button onClick={() => setShowUploadModal(true)} style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>+</span> Upload File
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {task.attachments.map(file => (
              <div key={file.id} style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e3f2fd'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{getFileIcon(file.fileType)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', color: '#333', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.fileName}</div>
                  <div style={{ fontSize: '13px', color: '#666' }}>{formatFileSize(file.fileSize)} · Uploaded by {file.uploadedBy.name} · {formatDate(file.uploadedAt)}</div>
                </div>
                <button style={{ padding: '8px 16px', backgroundColor: 'white', color: '#1976d2', border: '1px solid #1976d2', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Download</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showProgressModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowProgressModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '450px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: '24px', fontSize: '24px', color: '#333' }}>Update Task Progress</h3>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', color: '#666' }}>Progress: {progressValue}%</label>
              <input type="range" min="0" max="100" value={progressValue} onChange={(e) => setProgressValue(Number(e.target.value))} style={{ width: '100%', height: '8px', borderRadius: '4px', outline: 'none', cursor: 'pointer' }} />
              <div style={{ marginTop: '12px', height: '12px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressValue}%`, backgroundColor: '#1976d2', transition: 'width 0.2s' }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>Status</label>
              <select style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: 'white' }}>
                <option>Pending</option>
                <option selected>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>Notes (optional)</label>
              <textarea placeholder="Add notes about this progress update..." style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProgressModal(false)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={() => setShowProgressModal(false)} style={{ padding: '12px 24px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Save Progress</button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowUploadModal(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '500px', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, marginBottom: '24px', fontSize: '24px', color: '#333' }}>Upload File</h3>
            <div style={{ border: '2px dashed #e0e0e0', borderRadius: '8px', padding: '40px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#f8f9fa', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1976d2'; e.currentTarget.style.backgroundColor = '#e3f2fd'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.backgroundColor = '#f8f9fa'; }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📎</div>
              <div style={{ fontSize: '16px', color: '#333', marginBottom: '8px' }}>Click to browse or drag and drop</div>
              <div style={{ fontSize: '13px', color: '#666' }}>Maximum file size: 10MB</div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>File Description (optional)</label>
              <input type="text" placeholder="Enter file description..." style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowUploadModal(false)} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: '#666', border: '1px solid #e0e0e0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={() => setShowUploadModal(false)} style={{ padding: '12px 24px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}>Upload File</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
