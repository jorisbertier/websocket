"use client"

import { useState, useEffect } from 'react';

export function useUsersList() {
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('fetch userList start');
        fetch('http://localhost:3001/api/usersList', {
        credentials: 'include'
        })
        .then(res => {
            if (!res.ok) throw new Error('Unauthorized');
            return res.json();
        })
        .then(data => {
            console.log('user data:', data);
            setUsersList(data);
            setLoading(false);
        })
        .catch(err => {
            console.log('fetch user error:', err.message);
            setError(err.message);
            setLoading(false);
        });
    }, []);

    console.log({ usersList, loading, error });

    return { usersList, loading, error };
}
