import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateTeacher() {
  const { id } = useParams();
  const [form, setForm] = useState({ full_name: '', subject: '', phone: '', email: '' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/teachers/${id}`, { headers })
      .then(res => setForm(res.data));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/teachers/${id}`, form, { headers });
      alert('Teacher updated successfully');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h3>Update Teacher</h3>
      <form onSubmit={handleSubmit}>
        <input name="full_name" value={form.full_name} onChange={handleChange} required />
        <input name="subject" value={form.subject} onChange={handleChange} />
        <input name="phone" value={form.phone} onChange={handleChange} />
        <input name="email" value={form.email} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
