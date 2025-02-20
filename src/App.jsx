import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonationForm from './components/donation/DonationForm';
import DonationList from './components/donation/DonationList';
import DonationDetails from './components/donation/DonationDetails';
import VolunteerSignup from './components/volunteer/VolunteerSignup';
import TaskAssignment from './components/volunteer/TaskAssignment';
import Chatbot from './components/chat/Chatbot';
import EmergencyMode from './components/disaster/EmergencyMode';
import UrgentDonations from './components/disaster/UrgentDonations';

function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <WebSocketProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/donate" 
                  element={
                    <ProtectedRoute>
                      <DonationForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/donations" 
                  element={
                    <ProtectedRoute>
                      <DonationList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/donations/:id" 
                  element={
                    <ProtectedRoute>
                      <DonationDetails />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/volunteer/signup" 
                  element={
                    <ProtectedRoute>
                      <VolunteerSignup />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/volunteer/tasks" 
                  element={
                    <ProtectedRoute>
                      <TaskAssignment />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/emergency" 
                  element={
                    <ProtectedRoute>
                      <EmergencyMode />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/urgent-donations" 
                  element={
                    <ProtectedRoute>
                      <UrgentDonations />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              <Chatbot />
            </div>
          </Router>
        </WebSocketProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App; 