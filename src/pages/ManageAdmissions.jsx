import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageAdmissions() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    full_name: '',
    gender: '',
    date_of_birth: '',
    grade: '',
    section: '',
  });

  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/students', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEdit = student => {
    setEditing(student.id);
    setForm({
      full_name: student.full_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      grade: student.grade,
      section: student.section,
    });
  };

  const handleUpdate = async () => {
    await axios.put(`http://127.0.0.1:8000/api/students/${editing}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEditing(null);
    setForm({ full_name: '', gender: '', date_of_birth: '', grade: '', section: '' });
    fetchStudents();
  };

  const handleDelete = async id => {
    if (confirm('Are you sure you want to delete this student?')) {
      await axios.delete(`http://127.0.0.1:8000/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStudents();
    }
  };

  return (
    <div>
      <h3>Manage Student Admissions</h3>
      {editing && (
        <div>
          <h4>Editing Student</h4>
          <input name="full_name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <select name="gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={e => setForm({ ...form, date_of_birth: e.target.value })} />
          <input name="grade" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
          <input name="section" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s.id}>
              <td>{s.full_name}</td>
              <td>{s.gender}</td>
              <td>{s.date_of_birth}</td>
              <td>{s.grade}</td>
              <td>{s.section}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}