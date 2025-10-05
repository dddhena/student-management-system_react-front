import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './Dashboard';
import Admissions from './pages/Admissions';
import TeacherSubjectClassManagement from './pages/TeacherSubjectClassManagement';
import TeacherManagement from './pages/TeacherManagement';
import SubjectManagement from './pages/SubjectManagement';
import ClassManagement from './pages/ClassManagement';
import AssignSubject from './pages/AssignSubject';
import UpdateTeacher from './pages/UpdateTeacher';
import UpdateSubject from './pages/UpdateSubject';
import UpdateClass from './pages/UpdateClass';
import TeacherProfile from './pages/TeacherProfile';
import TeacherTimetable from './pages/TeacherTimetable';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherGrades from './pages/TeacherGrades';
import StudentGradeHistory from './pages/StudentGradeHistory';
import TeacherAssignments from './pages/TeacherAssignments';
import StudentAssignments from './pages/StudentAssignments';
import TeacherSubmissions from './pages/TeacherSubmissions';
import StudentAttendance from './pages/StudentAttendance';


function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        >
          {role === 'admin' && (
            <>
              <Route path="admin/admissions" element={<Admissions />} />
              <Route path="admin/teachers" element={<TeacherSubjectClassManagement />} />
              <Route path="admin/teachers/create" element={<TeacherManagement />} />
              <Route path="admin/subjects/create" element={<SubjectManagement />} />
              <Route path="admin/classes/create" element={<ClassManagement />} />
              <Route path="admin/assign-subject" element={<AssignSubject />} />
              <Route path="admin/teachers/update/:id" element={<UpdateTeacher />} />
              <Route path="admin/subjects/update/:id" element={<UpdateSubject />} />
              <Route path="admin/classes/update/:id" element={<UpdateClass />} />
            </>
          )}

          {role === 'student' && (
            <>
              <Route path="student/subjects" element={<div>📚 Student Subjects Page</div>} />
              <Route path="student/assignments" element={<StudentAssignments />} />
              <Route path="student/grades/:studentId" element={<StudentGradeHistory />} />
              <Route path="student/attendance" element={<StudentAttendance />} />
            </>
          )}

          {role === 'teacher' && (
            <>
              <Route path="teacher/profile" element={<TeacherProfile />} />
              <Route path="teacher/timetable" element={<TeacherTimetable />} />
              <Route path="teacher/attendance" element={<TeacherAttendance />} />
              <Route path="teacher/grades" element={<TeacherGrades />} />
              <Route path="student/grades/:studentId" element={<StudentGradeHistory />} />
              <Route path="teacher/assignments" element={<TeacherAssignments />} />
              <Route path="teacher/submissions" element={<TeacherSubmissions />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;
