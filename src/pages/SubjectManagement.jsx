import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubjectManagement() {
  const [form, setForm] = useState({ name: '', class_id: '', teacher_id: '' });
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
  try {
    const [subjectRes, classRes, teacherRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/subjects', { headers }),
      axios.get('http://127.0.0.1:8000/api/classes', { headers }),
      axios.get('http://127.0.0.1:8000/api/teachers', { headers }),
    ]);

    const subjectList = Array.isArray(subjectRes.data)
      ? subjectRes.data
      : subjectRes.data.subjects || subjectRes.data.data || [];

    const classList = Array.isArray(classRes.data)
      ? classRes.data
      : classRes.data.classes || classRes.data.data || [];

    const teacherList = Array.isArray(teacherRes.data)
      ? teacherRes.data
      : teacherRes.data.teachers || teacherRes.data.data || [];

    setSubjects(subjectList);
    setClasses(classList);
    setTeachers(teacherList);
  } catch (err) {
    console.error('Fetch error:', err.response?.data || err.message);
    setSubjects([]);
    setClasses([]);
    setTeachers([]);
  }
};

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/subjects/${editingId}`, form, { headers });
        alert('Subject updated');
      } else {
        await axios.post('http://127.0.0.1:8000/api/subjects', form, { headers });
        alert('Subject created');
      }
      setForm({ name: '', class_id: '', teacher_id: '' });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = subject => {
    setForm({
      name: subject.name || '',
      class_id: subject.class_id || '',
      teacher_id: subject.teacher_id || '',
    });
    setEditingId(subject.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/subjects/${id}`, { headers });
      alert('Deleted');
      fetchAll();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h2>Subject Management</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Subject Name" value={form.name} onChange={handleChange} required />
        <select name="class_id" value={form.class_id} onChange={handleChange} required>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
          <option value="">Assign Teacher (optional)</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Create'} Subject</button>
        {editingId && (
          <button type="button" onClick={() => {
            setForm({ name: '', class_id: '', teacher_id: '' });
            setEditingId(null);
          }}>Cancel</button>
        )}
      </form>

      <h3 style={{ marginTop: '2rem' }}>Subject List</h3>
      <table border="1" cellPadding="8" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{classes.find(c => c.id === s.class_id)?.name || '—'}</td>
              <td>{teachers.find(t => t.id === s.teacher_id)?.full_name || '—'}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
