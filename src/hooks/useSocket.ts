import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket(userId: string | undefined | null) {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io('http://localhost:3001', {
        withCredentials: true,
        });

        socket.emit('identify', userId);

        socketRef.current = socket;

        return () => {
        socket.disconnect();
        };
    }, [userId]);

    return socketRef;
}