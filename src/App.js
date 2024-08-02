// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketProvider';
import { NotificationProvider } from './components/AuthenticatedPages/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './components/PublicPages/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthenticatedLayout from './components/Layouts/AuthenticatedLayout';
import PublicLayout from './components/Layouts/PublicLayout';
import AboutUs from './components/PublicPages/AboutUs';
import Contact from './components/PublicPages/Contact';
import Dashboard from './components/AuthenticatedPages/Dashboard';
import Modules from './components/AuthenticatedPages/Modules';
import Assignments from './components/AuthenticatedPages/Assignments';
import Kanban from './components/AuthenticatedPages/Kanban';
import Profile from './components/AuthenticatedPages/Profile';
import Teams from './components/AuthenticatedPages/Teams';
import Projects from './components/AuthenticatedPages/Projects';
import ProjectDetails from './components/AuthenticatedPages/ProjectDetails';
import CallPage from './components/AuthenticatedPages/CallPage';
import VideoCall from './components/AuthenticatedPages/VideoCall';

const App = () => {
  return (
    <AuthProvider>
      <Router basename="/Uni-Pro-Frontend">
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated Routes */}
          <Route
            element={
              <PrivateRoute>
                <WebSocketProvider>
                  <NotificationProvider>
                    <AuthenticatedLayout />
                  </NotificationProvider>
                </WebSocketProvider>
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId/projects" element={<Projects />} />
            <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            <Route path="/call" element={<CallPage />} />
            <Route path="/video-call/:friendId" element={<VideoCall />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
