import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

export default function EventCard({ event, onClick }) {
    // default/placeholder data handling
    const {
        title = "Untitled Event",
        date = new Date(),
        location = "TBD",
        attendees = [],
        imageUrl
    } = event || {};

    const displayImage = imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800";

    const dateStr = new Date(date?.seconds ? date.seconds * 1000 : date).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div
            onClick={onClick}
            className="hover-scale"
            style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={displayImage}
                    alt={title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    backdropFilter: 'blur(4px)'
                }}>
                    {attendees.length} Going
                </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'white' }}>{title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <FaCalendarAlt color="var(--primary)" />
                    <span>{dateStr}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <FaMapMarkerAlt color="var(--primary)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</span>
                </div>
            </div>
        </div>
    );
}
