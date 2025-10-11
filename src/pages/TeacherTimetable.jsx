import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeacherTimetable.css';

export default function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teacher/timetable', { headers })
      .then(res => setTimetable(res.data.timetable))
      .catch(() => alert('Failed to load timetable'));
  }, []);

  return (
    <div className="timetable-view-container">
      <h2>📅 My Timetable</h2>
      {timetable.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <table className="timetable-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Room</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry, index) => (
              <tr key={index}>
                <td>{entry.day}</td>
                <td>{entry.start_time} – {entry.end_time}</td>
                <td>{entry.class?.name || '—'}</td>
                <td>{entry.subject?.name || '—'}</td>
                <td>{entry.room || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
