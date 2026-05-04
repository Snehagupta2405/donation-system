import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Donate from './pages/Donate';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorLogin from './pages/DonorLogin';
import VolunteerLogin from './pages/VolunteerLogin';
import AdminLogin from './pages/AdminLogin';
import DonorDashboard from './pages/donor/DonorDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import DonorChangePassword from './pages/donor/ChangePassword';
import VolunteerChangePassword from './pages/volunteer/ChangePassword';
import DonorProfile from './pages/donor/Profile';
import VolunteerProfile from './pages/volunteer/Profile';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Donations from './admin/Donations';
import Donors from './admin/Donors';
import Volunteers from './admin/Volunteers';
import ChangePassword from './admin/ChangePassword';
import AdminProfile from './admin/Profile';
import ManageDonations from './pages/admin/ManageDonations';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCategories from './pages/admin/ManageCategories';
import AssignDonation from './admin/AssignDonation';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route path="/volunteer-login" element={<VolunteerLogin />} />
        <Route path="/donor-change-password" element={<DonorChangePassword />} />
        <Route path="/volunteer-change-password" element={<VolunteerChangePassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Dashboards */}
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/donor-profile" element={<DonorProfile />} />
        <Route path="/volunteer-profile" element={<VolunteerProfile />} />

        {/* Admin app */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="donations" element={<Donations />} />
          <Route path="donors" element={<Donors />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="manage-donations" element={<ManageDonations />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-categories" element={<ManageCategories />} />
          <Route path="assign/:id" element={<AssignDonation />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App