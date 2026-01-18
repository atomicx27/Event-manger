import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const Login = ({ mode }) => {
    const isUserLoginRoute = mode === 'user'; // True if visiting /login, False if /admin-login
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const [isSignup, setIsSignup] = useState(false); // Local toggle state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // If we are on /admin-login, we enforce Login mode only (no admin signup via UI)
    const canToggle = isUserLoginRoute;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let success = false;
        if (isSignup) {
            success = await signup(email, password);
        } else {
            success = await login(email, password);
        }

        if (success) {
            navigate(isUserLoginRoute ? '/' : '/admin');
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '70vh'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        {isSignup ? 'Create Account' : (isUserLoginRoute ? 'Welcome Back' : 'Admin Portal')}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {isSignup ? 'Join to explore AR' : (isUserLoginRoute ? 'Login to continue' : 'Secure access only')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <FiUser style={{ position: 'absolute', top: '14px', left: '14px', color: '#666' }} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FiLock style={{ position: 'absolute', top: '14px', left: '14px', color: '#666' }} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '10px' }}>
                        {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Sign In')} <FiArrowRight />
                    </button>
                </form>

                {canToggle && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#FF6B00',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            {isSignup ? 'Already have an account? Login' : 'New here? Create an account'}
                        </button>
                    </div>
                )}

                {!isUserLoginRoute && (
                    <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
                        <p>Admin Access Only</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
