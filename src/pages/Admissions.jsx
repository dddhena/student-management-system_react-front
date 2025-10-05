import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admissions() {
  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    date_of_birth: '',
    class_id: '',
  });

  const [students, setStudents] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/students', { headers });
      setStudents(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/classes', { headers });
      setClassOptions(res.data.classes || []);
    } catch (err) {
      console.error('Class fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/students/${editingId}`, form, { headers });
        alert('Student updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admissions', form, { headers });
        alert('Student admitted successfully');
      }
      setForm({
        full_name: '',
        gender: '',
        date_of_birth: '',
        class_id: '',
      });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
      alert('Operation failed');
    }
  };

  const handleEdit = student => {
    setForm({
      full_name: student.full_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      class_id: student.class_id || '',
    });
    setEditingId(student.id);
  };

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/students/${id}`, { headers });
        fetchStudents();
      } catch (err) {
        console.error('Delete error:', err);
        alert('Deletion failed');
      }
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <h3>{editingId ? 'Update Student' : 'New Student Admission'}</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          name="date_of_birth"
          type="date"
          value={form.date_of_birth}
          onChange={handleChange}
          required
        />
        <select name="class_id" value={form.class_id} onChange={handleChange} required>
          <option value="">Select Class</option>
          {classOptions.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
        <button type="submit">{editingId ? 'Update' : 'Admit Student'}</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Registered Students</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Class</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) && students.map(s => (
            <tr key={s.id}>
              <td>{s.full_name}</td>
              <td>{s.gender}</td>
              <td>{s.date_of_birth}</td>
              <td>{s.class && s.class.name ? s.class.name : '—'}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)} style={{ marginLeft: '8px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
