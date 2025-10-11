import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateTimetable.css';

export default function CreateTimetable() {
  const [form, setForm] = useState({
    teacher_id: '',
    class_id: '',
    subject_id: '',
    day: '',
    start_time: '',
    end_time: '',
    room: '',
  });

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, classRes, subjectRes, timetableRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/teachers', { headers }),
          axios.get('http://127.0.0.1:8000/api/classes', { headers }),
          axios.get('http://127.0.0.1:8000/api/subjects', { headers }),
          axios.get('http://127.0.0.1:8000/api/admin/timetable', { headers }),
        ]);
        setTeachers(teacherRes.data);
        setClasses(classRes.data);
        setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data : subjectRes.data.subjects || []);
        setTimetable(timetableRes.data.timetable || []);
      } catch (err) {
        alert('Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/admin/timetable', form, { headers });
      alert('Timetable entry created');
      setForm({
        teacher_id: '',
        class_id: '',
        subject_id: '',
        day: '',
        start_time: '',
        end_time: '',
        room: '',
      });
      const res = await axios.get('http://127.0.0.1:8000/api/admin/timetable', { headers });
      setTimetable(res.data.timetable || []);
    } catch (err) {
      alert(err.response?.data?.error || 'Creation failed');
    }
  };

  return (
    <div className="timetable-container">
      <h2>Create Timetable Entry</h2>
      <form className="timetable-form" onSubmit={handleSubmit}>
        <select name="teacher_id" value={form.teacher_id} onChange={handleChange} required>
          <option value="">Select Teacher</option>
          {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>

        <select name="class_id" value={form.class_id} onChange={handleChange} required>
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select name="subject_id" value={form.subject_id} onChange={handleChange} required>
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select name="day" value={form.day} onChange={handleChange} required>
          <option value="">Select Day</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />
        <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required />
        <input name="room" placeholder="Room (optional)" value={form.room} onChange={handleChange} />

        <button type="submit" className="submit-button">Create Timetable</button>
      </form>

      <h3 style={{ marginTop: '2rem' }}>📋 Existing Timetable Entries</h3>
      {timetable.length === 0 ? (
        <p>No timetable entries found.</p>
      ) : (
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Teacher</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Day</th>
              <th>Time</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry, index) => (
              <tr key={index}>
                <td>{entry.teacher?.full_name || '—'}</td>
                <td>{entry.class?.name || '—'}</td>
                <td>{entry.subject?.name || '—'}</td>
                <td>{entry.day}</td>
                <td>{entry.start_time} – {entry.end_time}</td>
                <td>{entry.room || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
