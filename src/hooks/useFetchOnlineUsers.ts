import { useEffect } from 'react';

export function useFetchOnlineUsers(user: { _id: string } | null, setOnlineUsers: (ids: string[]) => void) {
    useEffect(() => {
        const fetchOnlineUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/online-users');
            const data: string[] = await res.json();
            setOnlineUsers(data);
        } catch (err) {
            console.error('Erreur lors du chargement des utilisateurs en ligne', err);
        }
        };

        if (user?._id) {
        fetchOnlineUsers();
        }
    }, [user, setOnlineUsers]);
}
