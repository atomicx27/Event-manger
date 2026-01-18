import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHome, FaPlus, FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Layout({ children }) {
    const { logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: FaHome, label: 'Feed', path: '/' },
        { icon: FaPlus, label: 'Create Event', path: '/create-event' }, // We'll make this a modal or page
        { icon: FaBell, label: 'Notifications', path: '/notifications' },
        { icon: FaUser, label: 'Profile', path: '/profile' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: 'var(--bg-card)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                borderRight: '1px solid #333',
                position: 'fixed',
                height: '100vh'
            }}>
                <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '30px', height: '30px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>EventHub</h1>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    color: active ? 'white' : 'var(--text-secondary)',
                                    background: active ? 'rgba(255, 127, 80, 0.15)' : 'transparent',
                                    fontWeight: active ? '600' : '400',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <item.icon color={active ? 'var(--primary)' : 'currentColor'} />
                                <span>{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        color: '#ff4444',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        marginTop: 'auto',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                    className="hover-scale"
                >
                    <FaSignOutAlt />
                    <span>Log Out</span>
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
