"use client";

import AuthGuard from "@/auth/authGuard";
import Chat from "@/component/chat";
import { useUser } from "@/hooks/useUser";

export default function Dashboard() {
    const { user } = useUser();

    return (
        <AuthGuard>
        <main className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800">
                Bienvenue sur votre dashboard, <span className="text-indigo-600">{user?.name}</span>
            </h1>

            {/* User info card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Informations utilisateur</h2>
                <p className="text-gray-600">
                <span className="font-medium">Nom :</span> {user?.name || "Inconnu"}
                </p>
                <p className="text-gray-600">
                <span className="font-medium">Gamer Tag :</span> {user?.pseudo || "Non défini"}
                </p>
            </div>

            {/* Chat component */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Zone de Chat</h2>
            </div>
            </div>
        </main>
        </AuthGuard>
    );
}
