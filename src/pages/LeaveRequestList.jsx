import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaveRequestList({ role }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    let endpoint = '';
    if (role === 'student') endpoint = '/leave/my-requests';
    else if (role === 'teacher') endpoint = '/leave/teacher-requests';
    else endpoint = '/leave/all';

    axios.get(`http://127.0.0.1:8000/api${endpoint}`, { headers })
      .then(res => {
        setRequests(res.data.requests);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leave requests:', err);
        setLoading(false);
      });
  }, [role]);

  const handleStatusUpdate = (leave_id, status) => {
    axios.patch('http://127.0.0.1:8000/api/leave/teacher-requests', { leave_id, status }, { headers })
      .then(res => {
        const updated = requests.map(r => r.id === leave_id ? res.data.leave : r);
        setRequests(updated);
      })
      .catch(err => console.error('Failed to update status:', err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Leave Requests ({role})</h2>

      {loading ? (
        <p>Loading leave requests...</p>
      ) : requests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              {role !== 'student' && (
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Student</th>
              )}
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Subject</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Teacher</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Start</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>End</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Reason</th>
              <th style={{ padding: '8px', border: '1px solid #ccc' }}>Status</th>
              {role === 'teacher' && (
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                {role !== 'student' && (
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {req.student?.user?.name || <em>Teacher-initiated</em>}
                  </td>
                )}
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {req.subject?.name || 'Unknown'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                  {req.teacher?.name || 'Unknown'}
                </td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{req.start_date}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{req.end_date}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{req.reason}</td>
                <td style={{ padding: '8px', border: '1px solid #ccc' }}>{req.status}</td>
                {role === 'teacher' && (
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>
                    {req.status === 'pending' ? (
                      <>
                        <button
                          style={{ marginRight: '6px', backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '6px 12px' }}
                          onClick={() => handleStatusUpdate(req.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '6px 12px' }}
                          onClick={() => handleStatusUpdate(req.id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ color: req.status === 'approved' ? 'green' : 'red' }}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
