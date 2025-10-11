import { useNavigate } from 'react-router-dom';

export default function TeacherManagement() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Teacher & Subject Management</h2>
    </div>
  );
}
