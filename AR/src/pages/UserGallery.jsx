import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FiBox } from 'react-icons/fi';

const UserGallery = () => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObjects = async () => {
            const snapshot = await getDocs(collection(db, 'objects'));
            setObjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchObjects();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Experience...</div>;

    return (
        <div>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '3rem', background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '0 0 10px 0' }}>
                    Explore Reality
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                    Select an object to view in your space.
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '30px'
            }}>
                {objects.map(obj => (
                    <Link to={`/ar/${obj.id}`} key={obj.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="glass-panel" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '220px', overflow: 'hidden' }}>
                                <img
                                    src={obj.thumbnailUrl}
                                    alt={obj.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </div>
                            <div style={{ padding: '20px', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>{obj.name}</h3>
                                <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiBox />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {objects.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                    <p>No objects found. Admin needs to add some cool stuff!</p>
                </div>
            )}
        </div>
    );
};

export default UserGallery;
