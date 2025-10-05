import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams

export default function StudentGradeHistory() { // Remove studentId from props
    const { studentId } = useParams(); // Get studentId from URL parameters
    const [grades, setGrades] = useState([]);
    const [studentName, setStudentName] = useState('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` }; // Corrected template literal syntax

    useEffect(() => {
        if (studentId) { // Ensure studentId is available before making the API call
            axios.get(`http://127.0.0.1:8000/api/students/${studentId}/grades`, { headers })
            .then(res => {
                setGrades(res.data.grades);
                setStudentName(res.data.student);
            })
            .catch(err => console.error('Grade history fetch error:', err));
        }
    }, [studentId, headers]); // Add headers to dependency array if it can change

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
            <h2>📊 Grade History for {studentName}</h2>
            {grades.length > 0 ? (
                <table border="1" cellPadding="8" style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Exam Type</th>
                            <th>Score</th>
                            <th>Teacher</th>
                            <th>Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((g, i) => (
                            <tr key={i}>
                                <td>{g.subject}</td>
                                <td>{g.exam_type}</td>
                                <td>{g.score}</td>
                                <td>{g.teacher}</td>
                                <td>{g.updated_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No grades recorded yet.</p>
            )}
        </div>
    );
}