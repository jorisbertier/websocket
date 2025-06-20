"use client"

import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import React, { useState } from 'react'

interface User {
    name: string;
    email: string;
    pseudo: string;
    // bio?: string;
    // avatarUrl: string;
}

const Profile: React.FC = () => {
    const [userT, setUser] = useState({
        username: 'JorisDev',
        email: 'joris@example.com',
        bio: 'Développeur passionné par React et Node.js 🚀',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
    });

    const { user } = useUser() as { user : User | null}
    console.log('ici', user)

    const [formData, setFormData] = useState({
        username: user?.name,
        email: user?.email,
        bio: userT.bio,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUser({ ...userT, ...formData });
        alert('Profil mis à jour !');
    };

    const handleAvatarChange = () => {
        // Simule le changement d’avatar
        const randomId = Math.floor(Math.random() * 70);
        setUser((prev) => ({
        ...prev,
        avatarUrl: `https://i.pravatar.cc/150?img=${randomId}`,
        }));
    };

    return (
            <div className="max-w-3xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-md">
        <div className="flex items-center gap-6 mb-8">
            {/* <Image
            width={30}
            height={30}
                src={user.avatarUrl}    
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            /> */}
            <div>
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <button
                onClick={handleAvatarChange}
                className="mt-2 px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Changer l’avatar
            </button>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
               Pseudo
            </label>
            <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
            </div>

            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
            </label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
            </div>

            <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
            </label>
            <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            />
            </div>

            <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
            >
            Sauvegarder
            </button>
        </form>
        </div>
    );
};

export default Profile;
