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
import CreateTimetable from './pages/CreateTimetable';
import StudentSubjects from './pages/StudentSubjects';
import LeaveRequestForm from './pages/LeaveRequestForm'; 
import LeaveRequestList from './pages/LeaveRequestList';
import TeacherClassList from './pages/TeacherClassList';
import ParentChildren from './pages/ParentChildren';






function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={token ? <Dashboard /> : <Navigate to="/" />}>
          {/* ✅ Admin routes */}
          <Route path="admin/admissions" element={<Admissions />} />
          <Route path="admin/teachers" element={<TeacherSubjectClassManagement />} />
          <Route path="admin/teachers/create" element={<TeacherManagement />} />
          <Route path="admin/subjects/create" element={<SubjectManagement />} />
          <Route path="admin/classes/create" element={<ClassManagement />} />
          <Route path="admin/assign-subject" element={<AssignSubject />} />
          <Route path="admin/teachers/update/:id" element={<UpdateTeacher />} />
          <Route path="admin/subjects/update/:id" element={<UpdateSubject />} />
          <Route path="admin/classes/update/:id" element={<UpdateClass />} />
          <Route path="admin/timetable/create" element={<CreateTimetable />} />
          <Route path="admin/leave-requests" element={<LeaveRequestList role="admin" />} />


          {/* ✅ Student routes */}
          <Route path="student/subjects" element={<StudentSubjects />} />
          <Route path="student/assignments" element={<StudentAssignments />} />
          <Route path="student/grades/:studentId" element={<StudentGradeHistory />} />
          <Route path="student/attendance" element={<StudentAttendance />} />
          <Route path="student/leave/apply" element={<LeaveRequestForm />} />
          <Route path="student/leave/requests" element={<LeaveRequestList role="student" />} />

          {/* ✅ Teacher routes */}
          <Route path="teacher/profile" element={<TeacherProfile />} />
          <Route path="teacher/timetable" element={<TeacherTimetable />} />
          <Route path="teacher/attendance" element={<TeacherAttendance />} />
          <Route path="teacher/grades" element={<TeacherGrades />} />
          <Route path="teacher/assignments" element={<TeacherAssignments />} />
          <Route path="teacher/submissions" element={<TeacherSubmissions />} />
          <Route path="student/grades/:studentId" element={<StudentGradeHistory />} />
          <Route path="teacher/leave-requests" element={<LeaveRequestList role="teacher" />} />
          <Route path="teacher/classes" element={<TeacherClassList />} />

           {/* ✅ Parent routes */}
          <Route path="parent/children" element={<ParentChildren />} />


        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
