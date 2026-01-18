import { useState, useEffect } from 'react';
import { eventService } from '../services/events';
import EventCard from '../components/EventCard';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'General', 'Social', 'Workshop', 'All Hands', 'Keynote'];

    useEffect(() => {
        const unsubscribe = eventService.subscribeToEvents((data) => {
            setEvents(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let filtered = events;

        // Filter by Category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(e => e.category === selectedCategory);
        }

        // Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query) ||
                e.location.toLowerCase().includes(query)
            );
        }

        setFilteredEvents(filtered);
    }, [events, selectedCategory, searchQuery]);

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Loading events...</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0, background: 'linear-gradient(to right, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Upcoming Events
                </h2>
                <Link
                    to="/create-event"
                    className="hover-scale"
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(255, 127, 80, 0.3)'
                    }}
                >
                    <FaPlus /> Create Event
                </Link>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
                <input
                    type="text"
                    placeholder="Search events by title, description, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--bg-card)',
                        border: '1px solid #333',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '1px solid #333',
                            background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-card)',
                            color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filteredEvents.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed #444'
                }}>
                    <h3 style={{ color: 'var(--text-secondary)' }}>No events found</h3>
                    <p style={{ color: '#666' }}>Be the first to create an amazing event!</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {filteredEvents.map(event => (
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
