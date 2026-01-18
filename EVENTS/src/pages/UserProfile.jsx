import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { FaUser, FaEnvelope, FaHistory } from 'react-icons/fa';

export default function UserProfile() {
    const { currentUser } = useAuth();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAttendedEvents() {
            if (!currentUser) return;
            try {
                // Fetch events where attendees array contains user ID
                const q = query(
                    collection(db, 'events'),
                    where('attendees', 'array-contains', currentUser.uid)
                    // Removed orderBy to avoid needing a composite index. We sort client-side anyway.
                );
                const snapshot = await getDocs(q);
                const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const now = new Date();

                const upcoming = [];
                const past = [];

                events.forEach(event => {
                    // Handle Firestore Timestamp or Date string/obj
                    let eventDate;
                    if (event.date?.seconds) {
                        eventDate = new Date(event.date.seconds * 1000);
                    } else {
                        eventDate = new Date(event.date);
                    }

                    if (eventDate >= now) {
                        upcoming.push(event);
                    } else {
                        past.push(event);
                    }
                });

                // Sort upcoming: closest first (asc)
                upcoming.sort((a, b) => {
                    const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
                    const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
                    return dateA - dateB;
                });

                // Past is already desc from query (newest past event first), but let's ensure
                past.sort((a, b) => {
                    const dateA = a.date?.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date);
                    const dateB = b.date?.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date);
                    return dateB - dateA;
                });

                setUpcomingEvents(upcoming);
                setPastEvents(past);

            } catch (error) {
                console.error("Error fetching attended events:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAttendedEvents();
    }, [currentUser]);

    if (loading) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '3rem',
                border: '1px solid #333'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    color: 'white'
                }}>
                    <FaUser />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>{currentUser.displayName || 'User'}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        <FaEnvelope /> {currentUser.email}
                    </div>
                </div>
            </div>

            {/* Upcoming Events Section */}
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <FaHistory color="var(--primary)" /> Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', marginBottom: '2rem', background: '#ffffff05', borderRadius: '12px' }}>
                    <p>No upcoming events.</p>
                    <Link to="/" style={{ color: 'var(--primary)' }}>Find events to join!</Link>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {upcomingEvents.map(event => (
                        <div key={event.id} onClick={() => window.location.href = `/events/${event.id}`} style={{ display: 'contents' }}>
                            <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <EventCard event={event} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Past Events Section */}
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '2rem', marginTop: '3rem' }}>
                <FaHistory color="#666" /> Past Events
            </h2>

            {pastEvents.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                    <p>No past event history.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                    opacity: 0.7 // Visual distinction for past events
                }}>
                    {pastEvents.map(event => (
                        <div key={event.id} onClick={() => window.location.href = `/events/${event.id}`} style={{ display: 'contents' }}>
                            <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <EventCard event={event} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
