import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../services/events';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        imageUrl: '',
        category: 'General',
        attendeesVisibility: 'private'
    });

    useEffect(() => {
        async function fetchEvent() {
            try {
                const docRef = doc(db, 'events', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.createdBy !== currentUser?.uid) {
                        setError("You don't have permission to edit this event.");
                        setLoading(false);
                        return;
                    }

                    // Format date for input: "YYYY-MM-DDThh:mm"
                    const dateObj = new Date(data.date?.seconds ? data.date.seconds * 1000 : data.date);
                    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

                    setFormData({
                        title: data.title,
                        date: localDate,
                        location: data.location,
                        description: data.description,
                        imageUrl: data.imageUrl || '',
                        category: data.category || 'General',
                        attendeesVisibility: data.attendeesVisibility || 'private'
                    });
                } else {
                    setError('Event not found.');
                }
            } catch (err) {
                setError('Failed to fetch event details.');
            } finally {
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id, currentUser]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const eventData = {
                ...formData,
                date: new Date(formData.date)
            };

            await eventService.updateEvent(id, eventData);
            navigate(`/events/${id}`);
        } catch (err) {
            setError('Failed to update event: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Edit Event</h1>

            {error && <div style={{ background: '#ff444420', color: '#ff4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Event Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white'
                        }}
                    >
                        <option value="General">General</option>
                        <option value="Social">Social</option>
                        <option value="Workshop">Workshop</option>
                        <option value="All Hands">All Hands</option>
                        <option value="Keynote">Keynote</option>
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Attendees Visibility</label>
                    <select
                        name="attendeesVisibility"
                        value={formData.attendeesVisibility}
                        onChange={handleChange}
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white'
                        }}
                    >
                        <option value="private">Owner Only (Default)</option>
                        <option value="public">Public (Everyone can see)</option>
                    </select>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
                        "Owner Only": Only you can see the list of people attending. "Public": Everyone sees the list.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-secondary)' }}>Date & Time</label>
                        <input
                            name="date"
                            type="datetime-local"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            style={{
                                padding: '12px',
                                background: 'var(--bg-input)',
                                border: '1px solid #444',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white',
                                colorScheme: 'dark'
                            }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-secondary)' }}>Location</label>
                        <input
                            name="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={handleChange}
                            style={{
                                padding: '12px',
                                background: 'var(--bg-input)',
                                border: '1px solid #444',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Image URL</label>
                    <input
                        name="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Description</label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white',
                            resize: 'vertical',
                            fontFamily: 'inherit'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate(`/events/${id}`)}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'transparent',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            flex: 2,
                            padding: '14px',
                            background: 'var(--primary)',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: 'white',
                            fontWeight: '600'
                        }}
                        className="hover-scale"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
