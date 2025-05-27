import { useState, useEffect } from 'react';

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('fetch user start');
    fetch('http://localhost:3001/api/me', {
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        console.log('user data:', data);
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('fetch user error:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log({ user, loading, error });

  return { user, loading, error };
}
