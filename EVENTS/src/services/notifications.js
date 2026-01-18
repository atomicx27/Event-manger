import { db } from './firebase';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

const EVENTS_COLLECTION = 'events';

export const notificationService = {
    // Get reminders for events starting in the next 24-48 hours that the user is attending
    getUpcomingReminders: async (userId) => {
        // Note: Firestore array-contains is simple, but combining with date ranges can be tricky with indexes.
        // For this MVP, we will fetch upcoming events and filter client-side or use a simple query.
        // A better production approach: Backend functions create 'notification' docs.
        // MVP Approach: Query all future events, filter for 'attendees' includes userId.

        try {
            const now = new Date();
            // Events in the future
            const q = query(
                collection(db, EVENTS_COLLECTION),
                where('date', '>=', now),
                orderBy('date', 'asc')
            );

            const snapshot = await getDocs(q);
            const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Filter for attendance and proximity (e.g., next 3 days)
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

            const reminders = events.filter(event => {
                const isAttending = event.attendees && event.attendees.includes(userId);
                const eventDate = event.date?.toDate ? event.date.toDate() : new Date(event.date);
                const isSoon = eventDate <= threeDaysFromNow;
                return isAttending && isSoon;
            });

            return reminders;
        } catch (error) {
            console.error("Error fetching reminders", error);
            return [];
        }
    }
};
