import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TeacherClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/classes', { headers })
      .then(res => {
        console.log('✅ Raw response from backend:', res.data);
        setClasses(res.data.classes);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to load classes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📚 My Classes & Students</h2>
      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p>No classes assigned.</p>
      ) : (
        classes.map(cls => (
          <div key={cls.id} style={{ marginBottom: '20px' }}>
            <h3>{cls.name}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '8px', border: '1px solid #ccc' }}>Full Name</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc' }}>Username</th>
                  <th style={{ padding: '8px', border: '1px solid #ccc' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {cls.students.map(student => {
                  console.log(`👤 Student ${student.id}:`, student);
                  return (
                    <tr key={student.id}>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                        {student.full_name || 'Unknown'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                        {student.user?.username || 'Unknown'}
                      </td>
                      <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                        {student.user?.email || 'N/A'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
