"use client"

import AuthGuard from "@/auth/authGuard";
import Chat from "@/component/chat";
import { useUser } from "@/hooks/useUser"


function Dashboard() {
    
    const { user} = useUser();
    
    // console.log(user)

    // console.log('voici connected user:',user)
    return (
        <AuthGuard>
            <div>Bienvenue sur votre dashboard {user?.name}</div>
            <div>Votre gamer tag est: {user?.pseudo}</div>
        </AuthGuard>
    )
}

export default Dashboard