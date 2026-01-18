import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FiArrowLeft, FiSmartphone } from 'react-icons/fi';
import '@google/model-viewer'; // Import web component

const ARView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [objectData, setObjectData] = useState(null);

    useEffect(() => {
        const fetchObj = async () => {
            const docRef = doc(db, 'objects', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setObjectData(docSnap.data());
            }
        };
        fetchObj();
    }, [id]);

    if (!objectData) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading AR Model...</div>;

    return (
        <div style={{ height: '80vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <button
                onClick={() => navigate(-1)}
                className="glass-panel"
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
            >
                <FiArrowLeft /> Back
            </button>

            <div style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', background: '#1a1a1a' }}>
                <model-viewer
                    src={objectData.modelUrl}
                    poster={objectData.thumbnailUrl}
                    alt={`One ${objectData.name}`}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    shadow-intensity="1"
                    style={{ width: '100%', height: '100%' }}
                >
                    <button slot="ar-button" style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        border: 'none',
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        padding: '12px 24px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#FF6B00'
                    }}>
                        <FiSmartphone /> View in AR
                    </button>
                </model-viewer>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h1>{objectData.name}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Interact with the 3D model above. On mobile, tap "View in AR" to place it in your room.
                    Use two fingers to rotate and pinch to resize.
                </p>
                <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '0.85rem' }}>
                    <strong style={{ display: 'block', marginBottom: '5px' }}>Top Troubleshooting Tips:</strong>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc' }}>
                        <li><strong>On Desktop?</strong> You cannot enter AR mode. Scan a QR code or open this link on your phone.</li>
                        <li><strong>On Mobile?</strong> Ensure you are using Chrome (Android) or Safari (iOS).</li>
                        <li><strong>Button not working?</strong> Make sure the site is served via HTTPS or you are using the Local Network IP (not localhost).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ARView;
