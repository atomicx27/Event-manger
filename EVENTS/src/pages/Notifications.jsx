import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notifications';
import { Link } from 'react-router-dom';
import { FaBell, FaCalendarCheck } from 'react-icons/fa';

export default function Notifications() {
    const { currentUser } = useAuth();
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReminders() {
            if (currentUser) {
                const data = await notificationService.getUpcomingReminders(currentUser.uid);
                setReminders(data);
                setLoading(false);
            }
        }
        fetchReminders();
    }, [currentUser]);

    if (loading) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Checking for reminders...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(255, 127, 80, 0.2)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                }}>
                    <FaBell />
                </div>
                <h1 style={{ margin: 0, fontSize: '2rem' }}>Notifications</h1>
            </div>

            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                Upcoming Reminders
            </h3>

            {reminders.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--text-secondary)'
                }}>
                    <p>No upcoming reminders.</p>
                    <p style={{ fontSize: '0.9rem' }}>Join some events to get notified!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reminders.map(event => {
                        const dateStr = new Date(event.date?.seconds ? event.date.seconds * 1000 : event.date).toLocaleString();
                        return (
                            <Link
                                key={event.id}
                                to={`/events/${event.id}`}
                                className="hover-scale"
                                style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    background: 'var(--bg-card)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid #333',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    background: 'var(--primary)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1.2rem'
                                }}>
                                    <FaCalendarCheck />
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'white' }}>Reminder: {event.title}</h3>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                        Coming up on <span style={{ color: 'var(--primary)' }}>{dateStr}</span>
                                    </p>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#666' }}>
                                    Tap to view
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
