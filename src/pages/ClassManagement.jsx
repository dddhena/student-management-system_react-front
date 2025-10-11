import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ClassManagement.css';

export default function ClassManagement() {
  const [form, setForm] = useState({ name: '', teacher_id: '' });
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    const [classRes, teacherRes] = await Promise.all([
      axios.get('http://127.0.0.1:8000/api/classes', { headers }),
      axios.get('http://127.0.0.1:8000/api/teachers', { headers }),
    ]);

    setClasses(Array.isArray(classRes.data) ? classRes.data : []);
    setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/classes/${editingId}`, form, { headers });
        alert('Class updated');
      } else {
        await axios.post('http://127.0.0.1:8000/api/classes', form, { headers });
        alert('Class created');
      }
      setForm({ name: '', teacher_id: '' });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = cls => {
    setForm({
      name: cls.name || '',
      teacher_id: cls.teacher_id || '',
    });
    setEditingId(cls.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this class?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/classes/${id}`, { headers });
      alert('Deleted');
      fetchAll();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="class-management-container">
      <h2 className="class-title">🏫 Class Management</h2>

      <form className="class-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Class Name (e.g. Grade 9A)"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
          <option value="">Assign Class Teacher (optional)</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>
              {t.full_name}
            </option>
          ))}
        </select>
        <button type="submit" className="submit-button">
          {editingId ? 'Update' : 'Create'} Class
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setForm({ name: '', teacher_id: '' });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="class-list-title">📋 Class List</h3>
      <table className="class-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(classes) &&
            classes.map(cls => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{teachers.find(t => t.id === cls.teacher_id)?.full_name || '—'}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(cls)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(cls.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
