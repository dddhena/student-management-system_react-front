import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentSubjects.css';

export default function StudentSubjects() {
  const [subjects, setSubjects] = useState([]);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/student/subjects', { headers })
      .then(res => {
        console.log('Subjects:', res.data.subjects);
        setSubjects(res.data.subjects);
      })
      .catch(err => {
        console.error('Error fetching subjects:', err);
        alert('Failed to load subjects');
      });
  }, []);

  return (
    <div className="subjects-container">
      <h2>📘 My Subjects</h2>
      {subjects.length === 0 ? (
        <p>No subjects assigned to your class.</p>
      ) : (
        <ul className="subjects-list">
          {subjects.map(sub => (
            <li key={sub.id}>{sub.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
