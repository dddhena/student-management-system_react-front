import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TeacherAssignments() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/subjects', { headers })
      .then(res => setSubjects(res.data))
      .catch(err => console.error('❌ Subject fetch error:', err));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/assignments', { headers })
      .then(res => setAssignments(res.data))
      .catch(err => console.error('❌ Assignment fetch error:', err));
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPdfFile(null);
    setSelectedSubjectId('');
    setEditingId(null);
    setErrorMsg('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('subject_id', selectedSubjectId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('due_date', dueDate);
    if (pdfFile) formData.append('pdf', pdfFile);

    let url = editingId
      ? `http://127.0.0.1:8000/api/assignments/${editingId}`
      : 'http://127.0.0.1:8000/api/teacher/assignments/submit';

    if (editingId) formData.append('_method', 'PUT');

    try {
      await axios.post(url, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert(editingId ? '✅ Assignment updated' : '✅ Assignment created');
      resetForm();

      const res = await axios.get('http://127.0.0.1:8000/api/teacher/assignments', { headers });
      setAssignments(res.data);
    } catch (err) {
      setErrorMsg('❌ Failed to submit assignment');
      console.error('Submission error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = assignment => {
    setTitle(assignment.title);
    setDescription(assignment.description);
    setDueDate(assignment.due_date);
    setSelectedSubjectId(assignment.subject_id);
    setEditingId(assignment.id);
    setPdfFile(null);
    setErrorMsg('');
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/assignments/${id}`, { headers });
      alert('✅ Assignment deleted');
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('❌ Failed to delete assignment');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '2rem' }}>
      <h2>{editingId ? '✏️ Edit Assignment' : '📤 Create Assignment'}</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Subject: </label>
          <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} required>
            <option value="">-- Choose Subject --</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Title: </label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description: </label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
        </div>
        <div>
          <label>Upload PDF: </label>
          <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : editingId ? 'Update Assignment' : 'Create Assignment'}
          </button>
          <button type="button" onClick={resetForm} style={{ marginLeft: '1rem' }}>
            Clear
          </button>
        </div>
        {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <button onClick={() => navigate('/dashboard/teacher/submissions')}>
        📥 View Student Submissions
      </button>

      <h3>📋 My Assignments ({assignments.length})</h3>
      {assignments.length > 0 ? (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Title</th>
              <th>Due Date</th>
              <th>PDF</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(a => (
              <tr key={a.id}>
                <td>{a.subject_name}</td>
                <td>{a.title}</td>
                <td>{new Date(a.due_date).toLocaleDateString()}</td>
                <td>
                  {a.pdf_path ? (
                    <a href={`http://127.0.0.1:8000/storage/${a.pdf_path}`} target="_blank" rel="noopener noreferrer">
                      📄 View PDF
                    </a>
                  ) : '—'}
                </td>
                <td>
                  <button onClick={() => handleEdit(a)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(a.id)}>🗑️ Delete</button>
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
