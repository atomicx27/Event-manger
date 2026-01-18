import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/events';
import { geminiService } from '../services/gemini';
import { pollinationsService } from '../services/pollinations';
import { storageService } from '../services/storage';
import { useAuth } from '../context/AuthContext';

export default function CreateEvent() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedData, setSuggestedData] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert date string to Date object
            const eventData = {
                ...formData,
                date: new Date(formData.date)
            };

            await eventService.createEvent(eventData, currentUser.uid);
            navigate('/');
        } catch (err) {
            setError('Failed to create event: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEnhance = async () => {
        if (!formData.title) {
            setError("Please enter at least a title for the AI to work with!");
            return;
        }

        setLoading(true);
        try {
            // 1. Generate Text details (Gemini)
            const { suggestedTitle, suggestedDescription, imageKeyword } = await geminiService.enhanceEventDetails(formData.title, formData);

            let finalImageUrl = formData.imageUrl;

            // 2. Generate Image (Pollinations.ai - Free)
            if (imageKeyword) {
                try {
                    const imagePrompt = `A high quality, photorealistic poster for ${imageKeyword}. ${suggestedTitle}. Professional, vibrant, 4k, cinematic lighting.`;

                    // Call Pollinations
                    const pollinationsUrl = await pollinationsService.generateImage(imagePrompt);

                    // Upload to Cloudinary (pass URL directly, let Cloudinary fetch it)
                    // If Cloudinary fails, storageService will fall back to using the URL directly
                    finalImageUrl = await storageService.uploadBase64Image(pollinationsUrl);

                } catch (imgError) {
                    console.error("Pollinations gen failed", imgError);
                    // Fallback to Unsplash
                    finalImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(imageKeyword)}`;
                }
            } else if (!finalImageUrl && imageKeyword) {
                finalImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(imageKeyword)}`;
            }

            setSuggestedData({
                title: suggestedTitle || formData.title,
                description: suggestedDescription || formData.description,
                imageUrl: finalImageUrl
            });
        } catch (err) {
            setError("AI Enhancement failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Create New Event</h1>

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
                        placeholder="e.g. Annual Tech Conference"
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white'
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleEnhance}
                        disabled={loading}
                        style={{
                            padding: '8px 12px',
                            background: 'linear-gradient(45deg, #FF9966, #FF5E62)',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            color: 'white',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            width: 'fit-content'
                        }}
                        className="hover-scale"
                    >
                        ✨ AI Enhance
                    </button>
                    {loading && <span style={{ fontSize: '0.8rem', color: '#888' }}>Thinking...</span>}
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
                            placeholder="e.g. Conference Room A"
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
                    <label style={{ color: 'var(--text-secondary)' }}>Image URL (Optional)</label>
                    <input
                        name="imageUrl"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        style={{
                            padding: '12px',
                            background: 'var(--bg-input)',
                            border: '1px solid #444',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Attendees Visibility</label>
                    <select
                        name="attendeesVisibility"
                        value={formData.attendeesVisibility || 'private'}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)' }}>Description</label>
                    <textarea
                        name="description"
                        required
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="What's this event about?"
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
                        onClick={() => navigate('/')}
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
                        disabled={loading}
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
                        {loading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </form>

            {suggestedData && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div className="animate-fade-in" style={{
                        background: '#1a1a1a',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '100%',
                        border: '1px solid #333',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}>
                        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            ✨ AI Suggestions
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#888' }}>New Title</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{suggestedData.title}</div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', color: '#888' }}>New Description</label>
                                <div style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{suggestedData.description}</div>
                            </div>

                            {suggestedData.imageUrl && (
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: '#888' }}>Suggested Image</label>
                                    <div style={{
                                        marginTop: '4px',
                                        height: '150px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        background: '#000'
                                    }}>
                                        <img
                                            src={suggestedData.imageUrl}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setSuggestedData(null)}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'transparent',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}>
                                Discard
                            </button>
                            <button
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        ...suggestedData
                                    }));
                                    setSuggestedData(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    background: 'linear-gradient(45deg, #FF9966, #FF5E62)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}>
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
