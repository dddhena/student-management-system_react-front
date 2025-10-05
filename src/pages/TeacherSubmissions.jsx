import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filters, setFilters] = useState({ assignment: '', subject: '' });
  const [grading, setGrading] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/submissions', { headers })
      .then(res => setSubmissions(res.data))
      .catch(err => console.error('❌ Failed to fetch submissions:', err));
  }, []);

  const handleGradeChange = (id, field, value) => {
    setGrading(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleGradeSubmit = async id => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/teacher/submissions/${id}/grade`, grading[id], { headers });
      alert('✅ Grade submitted');
    } catch (err) {
      alert('❌ Failed to submit grade');
      console.error(err.response?.data || err.message);
    }
  };

  const filtered = submissions.filter(s =>
    (!filters.assignment || s.assignment_title.toLowerCase().includes(filters.assignment.toLowerCase())) &&
    (!filters.subject || s.subject_name.toLowerCase().includes(filters.subject.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', padding: '2rem' }}>
      <h2>📥 Student Submissions</h2>

      {/* 🔍 Filters */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Filter by assignment"
          value={filters.assignment}
          onChange={e => setFilters(prev => ({ ...prev, assignment: e.target.value }))}
        />
        <input
          placeholder="Filter by subject"
          value={filters.subject}
          onChange={e => setFilters(prev => ({ ...prev, subject: e.target.value }))}
          style={{ marginLeft: '1rem' }}
        />
      </div>

      {filtered.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assignment</th>
              <th>Student</th>
              <th>Submitted At</th>
              <th>File</th>
              <th>Score</th>
              <th>Feedback</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td>{s.subject_name}</td>
                <td>{s.assignment_title}</td>
                <td>{s.student_name}</td>
                <td>{s.submitted_at ? new Date(s.submitted_at).toLocaleString() : '—'}</td>
                <td>
                  {s.file_url ? (
                    <a href={`http://127.0.0.1:8000/storage/${s.file_url}`} target="_blank" rel="noopener noreferrer">
                      📄 View PDF
                    </a>
                  ) : '—'}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={grading[s.id]?.score ?? s.score ?? ''}
                    onChange={e => handleGradeChange(s.id, 'score', e.target.value)}
                    style={{ width: '60px' }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={grading[s.id]?.feedback ?? s.feedback ?? ''}
                    onChange={e => handleGradeChange(s.id, 'feedback', e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleGradeSubmit(s.id)}>💾 Save</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
}
