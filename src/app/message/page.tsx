"use client"

import { useState } from 'react';

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Alice', text: 'Salut, ça va ?' },
    { id: 2, from: 'Bob', text: 'On se voit ce week-end ?' },
  ]);

  const [friends, setFriends] = useState(['Alice', 'Bob']);
  const [newFriend, setNewFriend] = useState('');

  const handleAddFriend = () => {
    if (newFriend && !friends.includes(newFriend)) {
      setFriends([...friends, newFriend]);
      setNewFriend('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Messagerie</h1>

      {/* Section Messages */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Messages reçus</h2>
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="border rounded p-3">
              <strong>{msg.from} :</strong> {msg.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Ajouter un ami */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un ami</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nom de l'ami"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddFriend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste d'amis */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Amis</h2>
        <ul className="list-disc list-inside">
          {friends.map((friend, idx) => (
            <li key={idx}>{friend}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
