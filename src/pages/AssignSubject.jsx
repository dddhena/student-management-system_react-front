import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssignSubject() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teachers', { headers }).then(res => setTeachers(res.data));
    axios.get('http://127.0.0.1:8000/api/subjects', { headers }).then(res => {
      const list = Array.isArray(res.data) ? res.data : res.data.subjects || res.data.data || [];
      setSubjects(list);
    });
  }, []);

  const handleAssign = async () => {
    if (!selectedTeacherId || !selectedSubjectId) return alert('Select both teacher and subject');
    try {
      await axios.post(`http://127.0.0.1:8000/api/teachers/${selectedTeacherId}/assign-subject`, {
        subject_id: selectedSubjectId,
      }, { headers });
      alert('Subject assigned successfully');
    } catch (err) {
      alert('Assignment failed');
    }
  };

  return (
    <div>
      <h3>Assign Subject to Teacher</h3>
      <select value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)}>
        <option value="">Select Teacher</option>
        {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
      </select>
      <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}>
        <option value="">Select Subject</option>
        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <button onClick={handleAssign}>Assign Subject</button>
    </div>
  );
}
