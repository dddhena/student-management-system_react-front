import { useEffect, useState } from 'react';
import api from '../api';

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Students</h1>
      <ul>
        {students.map(student => (
  <li key={student.id}>{student.full_name}</li>
))}

      </ul>
    </div>
  );
}
