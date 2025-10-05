import { useNavigate } from 'react-router-dom';

export default function TeacherManagement() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Teacher & Subject Management</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={() => navigate('/dashboard/admin/teachers/create')}>
          ➕ Create Teacher
        </button>
        <button onClick={() => navigate('/dashboard/admin/subjects/create')}>
          ➕ Create Subject
        </button>
        <button onClick={() => navigate('/dashboard/admin/classes/create')}>
          ➕ Create Class
        </button>
        <button onClick={() => navigate('/dashboard/admin/assign-subject')}>
          🔗 Assign Subject to Teacher
        </button>
      </div>
    </div>
  );
}
