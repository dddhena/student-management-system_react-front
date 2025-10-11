
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageAdmissions.css';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/students', { headers });
      setStudents(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load students');
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/classes', { headers });
      console.log('Classes API response:', res.data);
      const options = Array.isArray(res.data)
        ? res.data
        : res.data.classes || res.data.data || [];
      setClassOptions(options);
    } catch (err) {
      console.error('Class fetch error:', err);
      setError('Failed to load classes');
      setClassOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/students/${editingId}`, form, { headers });
        alert('Student updated successfully');
      } else {
        await axios.post('http://127.0.0.1:8000/api/admissions', form, { headers });
        alert('Student admitted successfully');
      }
      setForm({ full_name: '', gender: '', date_of_birth: '', class_id: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error('Submit error:', err.response?.data || err.message);
      alert('Operation failed');
    }
  };

  const handleEdit = (student) => {
    setForm({
      full_name: student.full_name,
      gender: student.gender,
      date_of_birth: student.date_of_birth,
      class_id: String(student.class_id || ''),
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
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
    <div className="admissions-container">
      <h3 className="admissions-title">
        {editingId ? 'Update Student' : 'New Student Admission'}
      </h3>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="admissions-form">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            name="full_name"
            placeholder="Enter full name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input
            name="date_of_birth"
            type="date"
            value={form.date_of_birth}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Class</label>
          <select
            name="class_id"
            value={form.class_id}
            onChange={handleChange}
            required
            disabled={loading}
            className="form-select"
          >
            <option value="">Select Class</option>
            {classOptions.length > 0 ? (
              classOptions.map((cls) => (
                <option key={cls.id} value={String(cls.id)}>
                  {cls.name || 'Unnamed Class'}
                </option>
              ))
            ) : (
              <option value="">No classes available</option>
            )}
          </select>
        </div>
        <button type="submit" className="submit-button">
          {editingId ? 'Update' : 'Admit Student'}
        </button>
      </form>
      <h3 className="table-title">Registered Students</h3>
      <div className="table-container">
        <table className="admissions-table">
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
            {Array.isArray(students) && students.length > 0 ? (
              students.map((s) => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>{s.gender}</td>
                  <td>{s.date_of_birth}</td>
                  <td>{s.class && s.class.name ? s.class.name : '—'}</td>
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(s)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
