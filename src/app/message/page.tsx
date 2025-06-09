"use client"

import { useUsersList } from '@/hooks/useUsersList';
import { useState } from 'react';

interface User {
  pseudo: string;
}

export default function MessagesPage() {

  const { usersList } = useUsersList();
  const [ filteredUsersList, setFilteredUsersList] = useState<User[]>([])
  console.log(filteredUsersList)

  console.log(typeof Object.values(usersList))


  const [messages, setMessages] = useState([
    { id: 1, from: 'Alice', text: 'Salut, ça va ?' },
    { id: 2, from: 'Bob', text: 'On se voit ce week-end ?' },
  ]);

  const [friends, setFriends] = useState(['Alice', 'Bob']);
  const [newFriend, setNewFriend] = useState('');

  const handleSearchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewFriend(value)

    const fiteredUsersList = usersList.filter((user: User) => user.pseudo?.trim().includes(value.trim()))
    setFilteredUsersList(fiteredUsersList)
  };
  const handleAddFriend = () => {
    if (newFriend && !friends.includes(newFriend)) {
      setFriends([...friends, newFriend]);
      setNewFriend('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Messagerie</h1>

      {/* Section Messages
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Messages reçus</h2>
        <ul className="space-y-2">
          {messages.map((msg) => (
            <li key={msg.id} className="border rounded p-3">
              <strong>{msg.from} :</strong> {msg.text}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Ajouter un ami */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un ami</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nom de l'ami"
            value={newFriend}
            onChange={handleSearchFriend}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleAddFriend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            add friend
          </button>
        </div>
      </div>
      {/* {newFriend && ( */}
            <ul>
              {filteredUsersList.map((friend, id) => (
                <li key={id}>{friend?.pseudo}</li>
              ))}
            </ul>
      {/* )} */}

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
