"use client"

import { useUser } from "@/hooks/useUser"


function Dashboard() {
    
    const { user, loading, error} = useUser();
    if(loading) return <p>Loading ...</p>
    if (error) return <p>Erreur: {error}</p>;

    console.log('voici connected user:',user)
    return (
        <div>Bienvenue sur votre dashboard {user?.name}</div>
    )
}

export default Dashboard