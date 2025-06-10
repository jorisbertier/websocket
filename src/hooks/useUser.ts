"use client"

import { useState, useEffect, useCallback } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/me', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setUser(null);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  console.log({ user, loading, error, setUser });

  return { user, loading, error, setUser };
}
