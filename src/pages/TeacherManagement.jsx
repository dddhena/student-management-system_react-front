import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TeacherManagement.css';

export default function TeacherManagement() {
  const [form, setForm] = useState({ full_name: '', subject: '', phone: '', email: '' });
  const [teachers, setTeachers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  const fetchTeachers = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/teachers', { headers });
    setTeachers(res.data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/teachers/${editingId}`, form, { headers });
        alert('Teacher updated');
      } else {
        await axios.post('http://127.0.0.1:8000/api/teachers', form, { headers });
        alert('Teacher created');
      }
      setForm({ full_name: '', subject: '', phone: '', email: '' });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const handleEdit = teacher => {
    setForm({
      full_name: teacher.full_name || '',
      subject: teacher.subject || '',
      phone: teacher.phone || '',
      email: teacher.email || '',
    });
    setEditingId(teacher.id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this teacher?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/teachers/${id}`, { headers });
      alert('Deleted');
      fetchTeachers();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="teacher-management-container">
      <h2 className="teacher-title">👩‍🏫 Teacher Management</h2>

      <form className="teacher-form" onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          name="subject"
          placeholder="Main Subject"
          value={form.subject}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <button type="submit" className="submit-button">
          {editingId ? 'Update' : 'Create'} Teacher
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setForm({ full_name: '', subject: '', phone: '', email: '' });
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3 className="teacher-list-title">📋 Teacher List</h3>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id}>
              <td>{t.full_name}</td>
              <td>{t.subject || '—'}</td>
              <td>{t.email || '—'}</td>
              <td>{t.phone || '—'}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(t)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
