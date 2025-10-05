import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/student/attendances', { headers })
      .then(res => setRecords(res.data))
      .catch(err => console.error('❌ Failed to fetch attendance:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '2rem' }}>
      <h2>📊 My Attendance</h2>
      {loading ? (
        <p>Loading attendance records...</p>
      ) : records.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, index) => (
              <tr key={index}>
                <td>{new Date(r.date).toLocaleDateString()}</td>
                <td>{r.subject ?? '—'}</td>
                <td>{r.teacher ?? '—'}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
}
