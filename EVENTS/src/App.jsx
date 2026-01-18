import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
import Notifications from './pages/Notifications';
import UserProfile from './pages/UserProfile';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/create-event" element={
          <PrivateRoute>
            <Layout>
              <CreateEvent />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/events/:id" element={
          <PrivateRoute>
            <Layout>
              <EventDetails />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/edit-event/:id" element={
          <PrivateRoute>
            <Layout>
              <EditEvent />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute>
            <Layout>
              <Notifications />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Layout>
              <UserProfile />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}
