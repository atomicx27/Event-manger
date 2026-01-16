import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Removed lucide-react import
// I installed react-icons. Let's use react-icons/fi or bi.
import { FiBox, FiLogOut, FiShield, FiHome } from 'react-icons/fi';

const Layout = () => {
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Premium Navbar */}
            <nav className="glass-panel" style={{
                margin: '20px',
                padding: '0 24px',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: '20px',
                zIndex: 100
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--primary-gradient)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <FiBox size={24} />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>AR<span style={{ color: '#FF6B00' }}>Space</span></span>
                </Link>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Link to="/" className={isActive('/') ? 'active-link' : 'nav-link'} style={{ color: isActive('/') ? '#FF6B00' : 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FiHome /> Gallery
                    </Link>

                    {isAdmin && (
                        <Link to="/admin" className={isActive('/admin') ? 'active-link' : 'nav-link'} style={{ color: isActive('/admin') ? '#FF6B00' : 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FiShield /> Dashboard
                        </Link>
                    )}

                    {user ? (
                        <button onClick={logout} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                            <FiLogOut style={{ marginRight: '5px' }} /> Logout
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/admin-login" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.9rem' }}>Admin</Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container animate-fade-in" style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-secondary)',
                borderTop: '1px solid var(--glass-border)',
                marginTop: 'auto'
            }}>
                <p>&copy; 2024 AR Space. Premium Experience.</p>
            </footer>
        </div>
    );
};

export default Layout;
