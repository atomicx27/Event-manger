import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { uploadToCloudinary } from '../utils/cloudinary';
import { FiUploadCloud, FiImage, FiBox, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [objects, setObjects] = useState([]);
    const [name, setName] = useState('');
    const [modelFile, setModelFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchObjects();
    }, []);

    const fetchObjects = async () => {
        const q = query(collection(db, 'objects'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        setObjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!modelFile || !imageFile || !name) {
            toast.error('Please fill in all fields');
            return;
        }

        setUploading(true);
        const toastId = toast.loading('Uploading assets...');

        try {
            // Upload Model
            const modelData = await uploadToCloudinary(modelFile);
            // Upload Image
            const imageData = await uploadToCloudinary(imageFile);

            // Save to Firestore
            await addDoc(collection(db, 'objects'), {
                name,
                modelUrl: modelData.secure_url,
                thumbnailUrl: imageData.secure_url,
                createdAt: new Date().toISOString()
            });

            toast.success('Object added successfully!', { id: toastId });
            setName('');
            setModelFile(null);
            setImageFile(null);
            fetchObjects();
        } catch (error) {
            console.error(error);
            toast.error('Upload failed: ' + (error.message || 'Unknown error'), { id: toastId, duration: 5000 });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '2rem' }}>Admin Dashboard</h2>
                <span className="glass-panel" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    {objects.length} Objects
                </span>
            </header>

            {/* Upload Section */}
            <section className="glass-panel" style={{ padding: '30px', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiPlus /> Add New Object
                </h3>

                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Object Name</label>
                        <input
                            className="input-field"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g. Vintage Chair"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div
                            style={{
                                border: '2px dashed var(--glass-border)',
                                padding: '20px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: modelFile ? 'rgba(255,107,0,0.1)' : 'transparent',
                                borderColor: modelFile ? '#FF6B00' : 'var(--glass-border)'
                            }}
                            onClick={() => document.getElementById('modelInput').click()}
                        >
                            <input type="file" id="modelInput" hidden accept=".glb,.gltf" onChange={e => setModelFile(e.target.files[0])} />
                            <FiBox size={30} style={{ marginBottom: '10px', color: modelFile ? '#FF6B00' : 'var(--text-secondary)' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{modelFile ? modelFile.name : 'Select 3D Model (.glb)'}</p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GLB is a 3D model format optimized for web and AR.</p>
                        </div>

                        <div
                            style={{
                                border: '2px dashed var(--glass-border)',
                                padding: '20px',
                                borderRadius: '10px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: imageFile ? 'rgba(255,107,0,0.1)' : 'transparent',
                                borderColor: imageFile ? '#FF6B00' : 'var(--glass-border)'
                            }}
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            <input type="file" id="imageInput" hidden accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            <FiImage size={30} style={{ marginBottom: '10px', color: imageFile ? '#FF6B00' : 'var(--text-secondary)' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>{imageFile ? imageFile.name : 'Select Thumbnail'}</p>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={uploading} style={{ alignSelf: 'flex-start' }}>
                        <FiUploadCloud /> {uploading ? 'Uploading...' : 'Publish to AR'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 107, 0, 0.1)', borderRadius: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                    <strong>Why only .glb?</strong>
                    <p style={{ marginTop: '5px' }}>
                        AR on the web relies on <code>.glb</code> (Binary glTF) because it packs textures and geometry into one small file that loads instantly on phones.
                        Formats like .obj or .fbx are too heavy and complex for browser AR.
                    </p>
                    <p>
                        Need to convert? Use <a href="https://gltf.report/" target="_blank" rel="noreferrer" style={{ color: '#FF6B00' }}>gltf.report</a> or Blender.
                    </p>
                </div>
            </section>

            {/* List Section */}
            <h3 style={{ marginBottom: '20px' }}>Library Content</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
                {objects.map(obj => (
                    <div key={obj.id} className="glass-panel" style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img src={obj.thumbnailUrl} alt={obj.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 5px 0' }}>{obj.name}</h4>
                            <a href={obj.modelUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#FF6B00' }}>View Source File</a>
                        </div>
                        {/* Could add delete button here */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
