import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateSubject() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', class_id: '', teacher_id: '' });
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/subjects/${id}`, { headers }).then(res => setForm(res.data));
    axios.get('http://127.0.0.1:8000/api/classes', { headers }).then(res => setClasses(res.data));
    axios.get('http://127.0.0.1:8000/api/teachers', { headers }).then(res => setTeachers(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/subjects/${id}`, form, { headers });
      alert('Subject updated successfully');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h3>Update Subject</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} required />
        <select name="class_id" value={form.class_id} onChange={handleChange}>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select name="teacher_id" value={form.teacher_id} onChange={handleChange}>
          <option value="">Assign Teacher</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
