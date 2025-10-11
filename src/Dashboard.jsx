import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const studentId = localStorage.getItem('user_id');

  const [userName, setUserName] = useState('');
  const [activeSidebarSection, setActiveSidebarSection] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUserName(res.data.username || res.data.name || 'Unknown');
      })
      .catch(() => {
        setUserName('Unknown');
      });
    }
  }, [token]);

  const [feeAmount, setFeeAmount] = useState(null);

useEffect(() => {
  if (studentId && token) {
    axios.get(`http://127.0.0.1:8000/api/student/${studentId}/fee`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFeeAmount(res.data.amount);
    })
    .catch(() => {
      setFeeAmount(null);
    });
  }
}, [studentId, token]);


  const handleLogout = async () => {
    try {
      if (token) {
        await axios.post('http://127.0.0.1:8000/api/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch {}
    finally {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
      navigate('/');
    }
  };
const handleTelebirrPayment = () => {
  axios.post('http://127.0.0.1:8000/api/pay/initiate', 
    { student_id: studentId, amount: feeAmount },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(res => {
    if (res.data.paymentUrl) {
      window.location.href = res.data.paymentUrl;
    } else {
      alert('Payment initiation failed.');
    }
  })
  .catch(err => {
    console.error('Telebirr error:', err);
    alert('Payment error occurred.');
  });
};




  return (
    <>
      <header className="dashboard-header">
        <h3>👋 Logged in as: <span>{userName || 'Loading...'}</span></h3>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <h2 className="dashboard-title">Welcome Student Management System</h2>
          <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
            🏠 Go to Home
          </button>

          <div className="dashboard-buttons">
            {role === 'admin' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/admissions')}>
                  Manage Admissions
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/timetable/create')}>
  🗓️ Create Timetable
</button>
<button className="dashboard-button" onClick={() => window.location.href = '/dashboard/admin/leave-requests'}>
  Admin Leave Requests
</button>
                <button
                  className="dashboard-button"
                  onClick={() => {
                    navigate('/dashboard/admin/teachers');
                    setActiveSidebarSection(prev => prev === 'teachers' ? '' : 'teachers');
                  }}
                >
                  Manage Teachers & Subjects
                </button>
                {activeSidebarSection === 'teachers' && (
                  <div className="dashboard-sub-buttons">
                    <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/teachers/create')}>
                      ➕ Create Teacher
                    </button>
                    <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/subjects/create')}>
                      ➕ Create Subject
                    </button>
                    <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/classes/create')}>
                      ➕ Create Class
                    </button>
                    <button className="dashboard-button" onClick={() => navigate('/dashboard/admin/assign-subject')}>
                      🔗 Assign Subject to Teacher
                    </button>
                  </div>
                )}
              </>
            )}

            {role === 'teacher' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/profile')}>
                  My Profile
                </button>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/timetable')}>
  🗓️ View My Timetable
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
                <button className="dashboard-button"onClick={() => navigate('/dashboard/teacher/leave-requests')}>
      Teacher Leave Requests
    </button>
    <button className="dashboard-button" onClick={() => navigate('/dashboard/teacher/classes')}>View & Manage My Classes</button>
              </>
            )}

            {role === 'student' && (
              <>
                <button className="dashboard-button" onClick={() => navigate('/dashboard/student/subjects')}>
  📘 View My Subjects
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

               <button className="dashboard-button" onClick={() => navigate('/dashboard/student/leave/apply')}>
      Apply for Leave
    </button>
            <button className="dashboard-button" onClick={() => navigate('/dashboard/student/leave/requests')}>
      View My Leave Requests
    </button>
              </>
            )}

            {role === 'parent' && (
              <>
              <button className="dashboard-button" onClick={() => navigate('/dashboard/parent/children')}>
                👪 View My Children
              </button>
               
</>
            )}
          

            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <main className="dashboard-content" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
