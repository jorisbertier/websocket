"use client"

import { useEffect } from "react";

interface DashboardProps {
    params: {
        idUser: string;
    };
}

function Dashboard({params} : DashboardProps) {

    useEffect(() => {
        try {
            const response = await fetch('http://localhost:3001/api/me',
                meyhod: 'GET',
                headers: {
                    "Content-type": application/json
                },
            )
        }
    })

    console.log('voici id user:', params.idUser)
    return (
        <div>Bienvenue sur votre dashboard Paul</div>
    )
}

export default Dashboard