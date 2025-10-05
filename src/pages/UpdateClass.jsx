import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateClass() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', teacher_id: '' });
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/classes/${id}`, { headers }).then(res => setForm(res.data));
    axios.get('http://127.0.0.1:8000/api/teachers', { headers }).then(res => setTeachers(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/classes/${id}`, form, { headers });
      alert('Class updated successfully');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h3>Update Class</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} required />
        <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
          <option value="">Assign Class Teacher</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
