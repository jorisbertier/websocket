"use client"

import { useUsersList } from '@/hooks/useUsersList';
import Image from 'next/image';
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
  {/* Section Ajout d'ami */}
  <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Rechercher un ami</h2>
        
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Entrez un pseudo..."
            value={newFriend}
            onChange={handleSearchFriend}
            className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {newFriend && (
            <ul className="bg-gray-50 border border-gray-200 rounded-lg shadow-inner max-h-40 overflow-y-auto">
              {filteredUsersList.length > 0 ? (
                filteredUsersList.map((friend, id) => (
                  <li
                    key={id}
                    className="px-4 py-2 hover:bg-blue-100 w-full cursor-pointer transition-all"
                    onClick={() => setNewFriend(friend.pseudo)}
                  >
                    <div className='w-full flex justify-between items-center py-2'>
                      {/* <Image/> */}
                      <span className='text-lg'>{friend.pseudo}</span>
                      <span className='bg-blue-300 rounded-md w-8 h-8 flex justify-center items-center hover:bg-blue-200'>+</span>
                    </div>
                    
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 italic">Aucun utilisateur trouvé</li>
              )}
            </ul>
          )}

          {/* <button
            onClick={handleAddFriend}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Ajouter l'ami
          </button> */}
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
