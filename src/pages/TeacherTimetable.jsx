import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/timetable', { headers })
      .then(res => setTimetable(res.data.timetable));
  }, []);
  return (
    <div>
      <h2>My Timetable</h2>
      {timetable.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subjects</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map(cls => (
              <tr key={cls.id}>
                <td>{cls.name}</td>
                <td>{cls.subjects.map(s => s.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
