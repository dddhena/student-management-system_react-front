import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import Admissions from './pages/Admissions';
import TeacherManagement from './pages/TeacherSubjectClassManagement';

export default function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('user_id');

  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUserName(res.data.name))
      .catch(err => console.warn('❌ Failed to fetch user name:', err));
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.warn('Logout error:', err.response?.data || err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
      navigate('/');
    }
  };

  return (
    <>
      {/* ✅ Full-width header */}
      <header className="dashboard-header">
        <h3>👋 Logged in as: <span>{userName || 'Loading...'}</span></h3>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <h2 className="dashboard-title">Welcome Student Management System</h2>

          <div className="dashboard-buttons">
            {role === 'admin' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/admissions')}>
                  Manage Admissions
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/teachers')}>
                  Manage Teachers & Subjects
                </button>
              </>
            )}

            {role === 'teacher' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/profile')}>
                  My Profile
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/timetable')}>
                  My Timetable
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/attendance')}>
                  Manage Attendance
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/grades')}>
                  Manage Grades
                </button>
                
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/assignments')}>
                  📤 Create Assignment
                </button>
              </>
            )}

            {role === 'student' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/student/subjects')}>
                  View My Subjects
                </button>
                <button className="dashboard-button" onClick={() => navigate(`/dashboard/student/grades/${studentId}`)}>
                  📊 View Grade History
                </button>
                
                <button className="dashboard-button" onClick={() => navigate('/dashboard/student/assignments')}>
                  📚 View & Submit Assignments
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/student/attendance')}>
                  📊 View My Attendance
                </button>
              </>
            )}

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
