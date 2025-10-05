import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherAttendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState('');
  const [records, setRecords] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [className, setClassName] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Fetch subjects assigned to the teacher
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/subjects', { headers })
      .then(res => setSubjects(res.data))
      .catch(err => console.error('Subject fetch error:', err));
  }, []);

  // ✅ Fetch students under the class of selected subject
  useEffect(() => {
    if (!selectedSubjectId) return;
    axios.get(`http://127.0.0.1:8000/api/subjects/${selectedSubjectId}/students`, { headers })
      .then(res => {
        setStudents(res.data.students);
        setSubjectName(res.data.subject);
        setClassName(res.data.class);
        setRecords(res.data.students.map(s => ({
          student_id: s.id,
          status: 'present'
        })));
      })
      .catch(err => console.error('Student fetch error:', err));
  }, [selectedSubjectId]);

  // ✅ Update attendance status for a student
  const updateStatus = (studentId, status) => {
    setRecords(prev =>
      prev.map(r => r.student_id === studentId ? { ...r, status } : r)
    );
  };

  // ✅ Submit attendance records
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/attendances/batch', {
        subject_id: selectedSubjectId,
        date,
        records
      }, { headers });
      alert('✅ Attendance recorded successfully');
    } catch (err) {
      alert('❌ Submit failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2>📋 Manage Attendance</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Select Subject: </label>
          <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} required>
            <option value="">-- Choose Subject --</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Date: </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        {subjectName && className && (
          <div style={{ marginBottom: '1rem' }}>
            <strong>Subject:</strong> {subjectName} <br />
            <strong>Class:</strong> {className}
          </div>
        )}

        {students.length > 0 && (
          <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>
                    <select
                      value={records.find(r => r.student_id === s.id)?.status || 'present'}
                      onChange={e => updateStatus(s.id, e.target.value)}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button type="submit" disabled={!date || !selectedSubjectId || students.length === 0}>
          Submit Attendance
        </button>
      </form>
    </div>
  );
}
