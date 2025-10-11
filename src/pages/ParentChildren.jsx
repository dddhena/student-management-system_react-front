import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ParentChildren() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/parent/children', { headers })
      .then(res => {
        console.log('✅ Children data:', res.data);
        setChildren(res.data.children);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Failed to load children:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>👨‍👩‍👧 My Children</h2>
      {loading ? (
        <p>Loading...</p>
      ) : children.length === 0 ? (
        <p>No children linked to your account.</p>
      ) : (
        children.map(child => (
          <div key={child.id} style={{ marginBottom: '30px' }}>
            <h3>{child.user?.name || child.full_name}</h3>
            <p><strong>Gender:</strong> {child.gender}</p>
            <p><strong>Date of Birth:</strong> {child.date_of_birth}</p>

            <h4>📊 Grades</h4>
            <ul>
              {child.grades.map(grade => (
                <li key={grade.id}>
                  {grade.subject?.name || 'Unknown Subject'}: {grade.score}
                </li>
              ))}
            </ul>

            <h4>📅 Attendance</h4>
            <ul>
                
              {child.attendance?.map(record => (

                <li key={record.id}>
                  {record.date}: {record.status}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
