import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
  if (!token) return;
  axios.get('http://127.0.0.1:8000/api/student/assignments', { headers })
    .then(res => setAssignments(Array.isArray(res.data) ? res.data : []))
    .catch(err => console.error('❌ Failed to fetch assignments:', err));
}, [token]);


  const handleFileChange = (assignmentId, file) => {
    setSelectedFile(prev => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = async (assignmentId) => {
    const formData = new FormData();
    formData.append('assignment_id', assignmentId);
    formData.append('file', selectedFile[assignmentId]);

    try {
      await axios.post('http://127.0.0.1:8000/api/student/assignments/submit', formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('✅ Submission successful');
    } catch (err) {
      alert('❌ Submission failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '2rem' }}>
      <h2>📚 My Assignments</h2>
      {assignments.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>PDF</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.subject_name}</td>
                <td>{a.title}</td>
                <td>{a.due_date}</td>
                <td>
                  {a.pdf_path ? (
                    <a href={`http://127.0.0.1:8000/storage/${a.pdf_path}`} target="_blank" rel="noopener noreferrer">
  📄 View PDF
</a>

                  ) : '—'}
                </td>
                <td>
                  <input type="file" accept="application/pdf"
                    onChange={e => handleFileChange(a.id, e.target.files[0])}
                  />
                  <button onClick={() => handleSubmit(a.id)} disabled={!selectedFile[a.id]}>
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No assignments found.</p>
      )}
    </div>
  );
}
