import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
// Pages (to be created)
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserGallery from './pages/UserGallery';
import ARView from './pages/ARView';

const PrivateRoute = ({ children, requireAdmin = false }) => {
    const { user, isAdmin } = useAuth();

    if (!user) return <Navigate to="/login" />;
    if (requireAdmin && !isAdmin) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<UserGallery />} />
                        <Route path="/login" element={<Login mode="user" />} />
                        <Route path="/admin-login" element={<Login mode="admin" />} />

                        <Route path="/ar/:id" element={<ARView />} />

                        <Route
                            path="/admin"
                            element={
                                <PrivateRoute requireAdmin={true}>
                                    <AdminDashboard />
                                </PrivateRoute>
                            }
                        />
                    </Route>
                </Routes>
            </Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
        </AuthProvider>
    );
}

export default App;
