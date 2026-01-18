import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { FaMapMarkerAlt, FaCalendarAlt, FaUser, FaArrowLeft, FaPaperPlane, FaEdit, FaTrash, FaCalendarPlus } from 'react-icons/fa';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to Event Document
        const eventRef = doc(db, 'events', id);
        const unsubscribeEvent = onSnapshot(eventRef, (docSnap) => {
            if (docSnap.exists()) {
                setEvent({ id: docSnap.id, ...docSnap.data() });
            } else {
                navigate('/'); // Event not found
            }
            setLoading(false);
        });

        // Subscribe to Comments
        const unsubscribeComments = eventService.subscribeToComments(id, (data) => {
            setComments(data);
        });

        return () => {
            unsubscribeEvent();
            unsubscribeComments();
        };
    }, [id, navigate]);

    const handleRsvp = async () => {
        if (!event) return;
        const isAttending = event.attendees?.includes(currentUser.uid);
        try {
            await eventService.toggleRsvp(id, currentUser, !isAttending);
        } catch (error) {
            console.error("Failed to update RSVP", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await eventService.addComment(id, currentUser, newComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await eventService.deleteEvent(id, currentUser.uid);
            navigate('/');
        } catch (error) {
            console.error("Failed to delete event", error);
            alert(error.message);
        }
    };

    const addToCalendar = () => {
        if (!event) return;
        const startTime = new Date(event.date?.seconds ? event.date.seconds * 1000 : event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endTime = new Date((event.date?.seconds ? event.date.seconds * 1000 : event.date) + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // Assume 2 hours
        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
        window.open(url, '_blank');
    };

    if (loading) return <div style={{ color: 'white', padding: '2rem', textAlign: 'center' }}>Loading details...</div>;
    if (!event) return null;

    const isAttending = event.attendees?.includes(currentUser.uid);
    const dateStr = new Date(event.date?.seconds ? event.date.seconds * 1000 : event.date).toLocaleString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1rem',
                        padding: 0
                    }}
                    className="hover-scale"
                >
                    <FaArrowLeft /> Back to Feed
                </button>

                {currentUser?.uid === event.createdBy && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => navigate(`/edit-event/${id}`)}
                            style={{ background: '#444', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                            className="hover-scale"
                            title="Edit Event"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={handleDelete}
                            style={{ background: '#ff4444', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                            className="hover-scale"
                            title="Delete Event"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            {/* Hero Image */}
            <div style={{
                height: '300px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                marginBottom: '2rem',
                position: 'relative'
            }}>
                <img
                    src={event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800"}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    padding: '2rem',
                    paddingTop: '4rem'
                }}>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'white' }}>{event.title}</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Event Info */}
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #333'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaCalendarAlt color="var(--primary)" size={20} />
                                <span style={{ fontSize: '1.1rem', color: 'white' }}>{dateStr}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaMapMarkerAlt color="var(--primary)" size={20} />
                                <span style={{ fontSize: '1.1rem', color: 'white' }}>{event.location}</span>
                            </div>
                        </div>

                        <hr style={{ borderColor: '#333', margin: '1.5rem 0' }} />

                        <h3 style={{ color: 'white', marginTop: 0 }}>About Event</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {event.description}
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #333'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Discussion ({comments.length})</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                            {comments.map(comment => (
                                <div key={comment.id} style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                            {comment.userName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ background: 'var(--bg-input)', padding: '10px 14px', borderRadius: '12px', flex: 1 }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', marginBottom: '4px' }}>
                                            {comment.userName}
                                        </div>
                                        <div style={{ color: 'white', fontSize: '0.95rem' }}>{comment.text}</div>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No comments yet. Start the discussion!</p>}
                        </div>

                        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid #444',
                                    background: 'var(--bg-input)',
                                    color: 'white'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    background: 'var(--primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    width: '46px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}
                                className="hover-scale"
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Sidebar / RSVP Action */}
                <div>
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid #333',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Are you going?</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {event.attendees?.length || 0} people are attending.
                        </p>

                        {/* Attendees List */}
                        {event.attendeeList && event.attendeeList.length > 0 && (
                            (event.attendeesVisibility === 'public' || event.createdBy === currentUser.uid) ? (
                                <div style={{ marginBottom: '1.5rem', maxHeight: '150px', overflowY: 'auto', background: '#222', padding: '10px', borderRadius: '8px' }}>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>
                                        {event.attendeesVisibility === 'private' ? '🔒 ATTENDEES (Private to you)' : '👥 ATTENDEES (Public)'}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {event.attendeeList.map((attendee, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>
                                                    {attendee.name.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{attendee.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
                                        Attendee list is private.
                                    </p>
                                </div>
                            )
                        )}

                        <button
                            onClick={handleRsvp}
                            className="hover-scale"
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: isAttending ? '#333' : 'var(--primary)',
                                color: isAttending ? '#aaa' : 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {isAttending ? (
                                <>
                                    <span>✓ You are going</span>
                                </>
                            ) : 'RSVP Now'}
                        </button>

                        <button
                            onClick={addToCalendar}
                            className="hover-scale"
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                padding: '14px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid #444',
                                background: 'transparent',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            <FaCalendarPlus /> Add to Calendar
                        </button>
                    </div>
                </div>

            </div>
        </div >
    );
}
