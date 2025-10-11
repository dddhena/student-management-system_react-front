import { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveRequestForm() {
  const [form, setForm] = useState({
    subject_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [subjects, setSubjects] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch subjects for the logged-in student
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/student/subjects', { headers })
      .then(res => setSubjects(res.data.subjects))
      .catch(err => console.error('Failed to load subjects:', err));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/leave/apply', form, { headers })
      .then(res => alert('✅ Leave request submitted'))
      .catch(err => alert('❌ Submission failed'));
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>📝 Apply for Leave</h2>
      <form onSubmit={handleSubmit}>
        <label>Subject</label>
        <select
          value={form.subject_id}
          onChange={e => setForm({ ...form, subject_id: e.target.value })}
          required
        >
          <option value="">Select subject</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={form.start_date}
          onChange={e => setForm({ ...form, start_date: e.target.value })}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          value={form.end_date}
          onChange={e => setForm({ ...form, end_date: e.target.value })}
          required
        />

        <label>Reason</label>
        <textarea
          value={form.reason}
          onChange={e => setForm({ ...form, reason: e.target.value })}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
