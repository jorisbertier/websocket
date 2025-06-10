'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    error: string | null;
    refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = () => {
        setLoading(true);
        fetch('http://localhost:3001/api/me', { credentials: 'include' })
        .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
        })
        .then(data => {
            setUser(data);
            setError(null);
            setLoading(false);
        })
        .catch(err => {
            setUser(null);
            setError(err.message);
            setLoading(false);
        });
    };

    // useEffect(() => {
    //     fetchUser();
    // }, []);

    useEffect(() => {
        console.log("User changed in context:", user);
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error, refreshUser: fetchUser }}>
        {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
