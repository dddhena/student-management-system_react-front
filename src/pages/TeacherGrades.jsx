import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherGrades() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [examType, setExamType] = useState('quiz');
  const [grades, setGrades] = useState([]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Fetch subjects assigned to teacher
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/subjects', { headers })
      .then(res => setSubjects(res.data))
      .catch(err => console.error('Subject fetch error:', err));
  }, []);

  // ✅ Fetch students for selected subject
  useEffect(() => {
    if (!selectedSubjectId) return;
    axios.get(`http://127.0.0.1:8000/api/subjects/${selectedSubjectId}/students`, { headers })
      .then(res => {
        setStudents(res.data.students);
        setGrades(res.data.students.map(s => ({
          student_id: s.id,
          score: ''
        })));
      })
      .catch(err => console.error('Student fetch error:', err));
  }, [selectedSubjectId]);

  // ✅ Update score for a student
  const updateScore = (studentId, score) => {
    setGrades(prev =>
      prev.map(g => g.student_id === studentId ? { ...g, score } : g)
    );
  };

  // ✅ Submit grades
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      for (const grade of grades) {
        await axios.post('http://127.0.0.1:8000/api/grades/store', {
          student_id: grade.student_id,
          subject_id: selectedSubjectId,
          exam_type: examType,
          score: grade.score
        }, { headers });
      }
      alert('✅ Grades recorded successfully');
    } catch (err) {
      alert('❌ Grade submission failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2>📝 Record Grades</h2>

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
          <label>Exam Type: </label>
          <select value={examType} onChange={e => setExamType(e.target.value)} required>
            <option value="quiz">Quiz</option>
            <option value="midterm">Midterm</option>
            <option value="final">Final</option>
          </select>
        </div>

        {students.length > 0 && (
          <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '1rem' }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.full_name}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades.find(g => g.student_id === s.id)?.score || ''}
                      onChange={e => updateScore(s.id, e.target.value)}
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button type="submit" disabled={!selectedSubjectId || students.length === 0}>
          Submit Grades
        </button>
      </form>
    </div>
  );
}
