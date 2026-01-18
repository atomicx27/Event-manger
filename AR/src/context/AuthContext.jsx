import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// Simple Admin Check logic (replace with claims or DB check in production)
const ADMIN_EMAILS = ['admin@orange.com'];

// Preset Admin Credentials
const ADMIN_EMAIL = 'admin@orange.com';
const ADMIN_PASS = 'admin123';

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsAdmin(ADMIN_EMAILS.includes(currentUser.email));
                setLoading(false);
            } else {
                // Check local storage for mock admin
                const storedAdmin = localStorage.getItem('mockAdmin');
                if (storedAdmin) {
                    const mockUser = JSON.parse(storedAdmin);
                    setUser(mockUser);
                    setIsAdmin(true);
                    setLoading(false);
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setLoading(false);
                }
            }
        });
        return unsubscribe;
    }, []);

    const login = async (email, password) => {
        const cleanEmail = email.trim().toLowerCase();
        const cleanPass = password.trim();

        // Check Preset Admin first
        if (cleanEmail === ADMIN_EMAIL && cleanPass === ADMIN_PASS) {
            const mockUser = {
                uid: 'mock-admin-id',
                email: ADMIN_EMAIL,
                displayName: 'Admin'
            };
            setUser(mockUser);
            setIsAdmin(true);
            localStorage.setItem('mockAdmin', JSON.stringify(mockUser));
            toast.success('Welcome Admin!');
            return true;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Welcome back!');
            return true;
        } catch (error) {
            toast.error('Login failed: ' + error.message);
            return false;
        }
    };

    const signup = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success('Account created! Welcome.');
            return true;
        } catch (error) {
            toast.error('Signup failed: ' + error.message);
            return false;
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('mockAdmin');
        setUser(null);
        setIsAdmin(false);
        toast.success('Logged out');
    };

    const value = {
        user,
        isAdmin,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
