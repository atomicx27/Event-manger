import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDyOrtBEqAK-J5ParJSeVWlYkO99SHZySs",
    authDomain: "ar-app-1b2b4.firebaseapp.com",
    projectId: "ar-app-1b2b4",
    storageBucket: "ar-app-1b2b4.firebasestorage.app",
    messagingSenderId: "483918015409",
    appId: "1:483918015409:web:19dc3d01b7f56e5f0eab90"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
