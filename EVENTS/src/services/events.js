import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, query, orderBy, onSnapshot } from "firebase/firestore";

const EVENTS_COLLECTION = 'events';

export const eventService = {
    // Create a new event
    createEvent: async (eventData, userId) => {
        try {
            const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
                ...eventData,
                createdBy: userId,
                createdAt: new Date(),
                attendees: []
            });
            return docRef.id;
        } catch (error) {
            throw error;
        }
    },

    // Get all events (real-time listener)
    subscribeToEvents: (callback) => {
        const q = query(collection(db, EVENTS_COLLECTION), orderBy('date', 'asc'));
        return onSnapshot(q, (snapshot) => {
            const events = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(events);
        });
    },

    // Toggle RSVP
    toggleRsvp: async (eventId, user, isAttending) => {
        const eventRef = doc(db, EVENTS_COLLECTION, eventId);
        const attendeeData = {
            uid: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email // optional, maybe avoid PII if not needed
        };

        if (isAttending) {
            await updateDoc(eventRef, {
                attendees: arrayUnion(user.uid), // Keep this for backward compatibility/easy count check
                attendeeList: arrayUnion(attendeeData) // New field for detailed list
            });
        } else {
            // Removing objects from arrayUnion requires exact match. 
            // Since we construct attendeeData fresh, it should match if fields haven't changed.
            // However, a safer way for removing complex objects is reading the doc, filtering, and updating.
            // For MVP, allow arrayRemove if object structure is stable.
            await updateDoc(eventRef, {
                attendees: arrayRemove(user.uid),
                attendeeList: arrayRemove(attendeeData)
            });
        }
    },

    // Get single event
    getEvent: async (eventId) => {
        const docRef = doc(db, EVENTS_COLLECTION, eventId);
        // We'll rely on onSnapshot in the component for real-time single event too, 
        // but this helper might be useful or we can just use regular Firestore SDK in component.
        // Let's return the reference wrapper for the component to reuse logic if needed, 
        // but typically we just use onSnapshot(doc(...))
        return docRef;
    },

    // Add Comment
    addComment: async (eventId, userData, text) => {
        const commentsRef = collection(db, EVENTS_COLLECTION, eventId, 'comments');
        await addDoc(commentsRef, {
            text,
            userId: userData.uid,
            userName: userData.displayName || 'Anonymous',
            createdAt: new Date()
        });
    },

    // Subscribe to Comments
    subscribeToComments: (eventId, callback) => {
        const commentsRef = collection(db, EVENTS_COLLECTION, eventId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));
        return onSnapshot(q, (snapshot) => {
            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(comments);
        });
    },

    // Delete Event
    deleteEvent: async (eventId, currentUserId) => {
        const docRef = doc(db, EVENTS_COLLECTION, eventId);

        // Security Check: Verify ownership before delete
        // (Note: Firestore Security Rules should be the primary enforcer, this is a UI/Client safeguard)
        const docSnap = await getDocs(query(collection(db, EVENTS_COLLECTION), where('__name__', '==', eventId)));

        if (!docSnap.empty) {
            const eventData = docSnap.docs[0].data();
            if (eventData.createdBy !== currentUserId) {
                throw new Error("Unauthorized: You can only delete your own events.");
            }
        }

        await deleteDoc(docRef);
    },

    // Update Event
    updateEvent: async (eventId, eventData) => {
        const docRef = doc(db, EVENTS_COLLECTION, eventId);
        await updateDoc(docRef, eventData);
    }
};
