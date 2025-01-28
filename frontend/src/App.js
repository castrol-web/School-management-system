import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Students from "./admin/Students";
import Login from "./pages/Login";
import Teachers from "./admin/Teachers";
import AddSubject from "./admin/AddSubject";
import AddClass from "./admin/AddClass";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import TeacherLayout from "./pages/TeacherLayout";
import Marks from "./pages/Marks";
import Entries from "./pages/Entries";
import ReportForms from "./pages/ReportForms";
import SendMessage from "./components/SendMessage";
import Parents from "./admin/Parents";
import HomePage from "./pages/HomePage";
import CreateTimetable from "./components/CreateTimetable";
import InvoiceCreation from "./admin/InvoiceCreation";
import ParentLayout from "./parent/ParentLayout";
import ParentDashboard from "./parent/ParentDashboard";
import Invoice from "./parent/Invoice";
import AssignmentCreator from "./components/AssignmentCreator";
import AssignmentViewer from "./parent/AssignmentViewer";
import AddActivity from "./components/AddActivity";
import EnrollActivity from "./parent/EnrollActivity";


//backend url
export const URL = process.env.REACT_APP_SERVER_URL;
export const PAYSTACK = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="parents" element={<Parents />} />
          <Route path="subjects" element={<AddSubject />} />
          <Route path="classes" element={<AddClass />} />
          <Route path="messages" element={<SendMessage />} />
          <Route path="invoices" element={<InvoiceCreation />} />
        </Route>

        {/* Teacher routes below */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="marks" element={<Marks />} />
          <Route path="entries" element={<Entries />} />
          <Route path="timetable-entry" element={<CreateTimetable />} />
          <Route path="reports" element={<ReportForms />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="activities" element={<AddActivity />} />
          <Route path="messages" element={<SendMessage />} />
          <Route path="assignments" element={<AssignmentCreator />} />
        </Route>
        {/* parents routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="invoices" element={<Invoice />} />
          <Route path="assignments" element={<AssignmentViewer />} />
          <Route path="activities" element={<EnrollActivity />} />
        </Route>

        {/* general routes  */}
        <Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
