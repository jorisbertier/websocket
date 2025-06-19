"use client"

import Modal from '@/component/Modal';
import { useUser } from '@/hooks/useUser';
import { useUsersList } from '@/hooks/useUsersList';
import { useEffect, useState } from 'react';
import { sendFriendRequest, respondToFriendRequest, cancelFriendRequest } from '../../api/api'

interface User {
  _id: string;
  pseudo: string;
  friends?: [];
  friendRequests?: [],
  friendRequestsSent?: [],
}

// interface Message {
//   id: number;
//   from: string;
//   text: string;
// }

export default function MessagesPage() {

  const { usersList } = useUsersList() as { usersList: User[] };
  const { user} = useUser() as { user: User | null };
  console.log('userList',usersList)
  // console.log('user: ',user)

  /* List of friends */
  const currentFriendsPseudos = user?.friends
  ?.map((friendId: string) => usersList.find((u) => u._id === friendId))
  .filter(Boolean)
  .map((friend) => friend?.pseudo?.trim());

  const [ filteredUsersList, setFilteredUsersList] = useState<User[]>([])
  const [friendRequests, setFriendRequests] = useState<string[]>(user?.friendRequests || []);

  const [showModal, setShowModal] = useState(false);
  const [showModalReject, setShowModalReject] = useState(false);
  const [showModalRequestSent, setShowModalRequestSent] = useState(false);

  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([])

  useEffect(() => {
    if (user?.friendRequests) {
      setFriendRequests(user.friendRequests);
    }
    if (user?.friendRequestsSent) {
      setPendingFriendRequests(user.friendRequestsSent);
    }
  }, [user]);

  const [newFriend, setNewFriend] = useState('');

  const handleSearchFriend = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewFriend(value)

    const deleteUserConnected = usersList.filter((u: User) => u.pseudo?.trim() != user?.pseudo.trim())
    const deleteFriendToList = deleteUserConnected.filter((u: User) => !currentFriendsPseudos?.includes(u?.pseudo))
    const deleteRequestSent = deleteFriendToList.filter((u: User) => !user?.friendRequestsSent?.includes(u?.pseudo))
    const fiteredUsersList = deleteRequestSent.filter((user: User) => user.pseudo?.trim().includes(value.trim()))
    setFilteredUsersList(fiteredUsersList)
  };

  const handleAddFriend = async (pseudo: string) => {

    const result = await sendFriendRequest(user?._id, pseudo);

    if (result.success) {
      console.log('Request sent');
      setFilteredUsersList(filteredUsersList.filter((u) => u.pseudo !== pseudo));
      setShowModalRequestSent(true);
    } else {
      console.log('Error while sending friend request:', result.message);
    }
  };

  const handleRespond = async(requestId: string, action: string) => {

    const result = await respondToFriendRequest(requestId, user?._id, action);

    if (result?.success) {
      console.log(`Request ${action}ed`);
      setFriendRequests((prev) => prev.filter((id) => id !== requestId));
      if (action === 'accept') setShowModal(true);
      else setShowModalReject(true);
    } else {
      console.log('Error while sending friend request:', result?.message);
    }
  }

  const handleCancelFriendRequest = async(pseudo: string) => {

    const result = await cancelFriendRequest(pseudo, user?.pseudo);

    if (result?.success) {
        console.log(`Request canceled`);
        setPendingFriendRequests(prev => prev.filter((p) => p !== pseudo));
        setShowModalReject(true);
    } else {
      console.log('Error while sending friend request:', result?.message);
    }
  }

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

  {/* Section Ajout d'ami */}
  <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Rechercher un utilisateur</h2>
        
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
                filteredUsersList.map((friend) => (
                  <li
                    key={friend._id}
                    className="px-4 py-2 hover:bg-blue-100 w-full transition-all"
                  >
                    <div className='w-full flex justify-between items-center py-2'>
                      {/* <Image/> */}
                      <span className='text-lg'>{friend?.pseudo}</span>
                      <button aria-label='add a friend request' onClick={() => handleAddFriend(friend.pseudo)} className='bg-blue-300 cursor-pointer rounded-md w-8 h-8 flex justify-center items-center hover:bg-blue-200'>+</button>
                    </div>
                    
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500 italic">Aucun utilisateur trouvé</li>
              )}
            </ul>
          )}

        </div>
        </div>

      {/*Demande recue d'amis*/}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Friend request received</h2>
        <ul className="list-disc list-inside">
        {friendRequests?.map((requestId: string) => {

          const sender = usersList.find((u) => u._id === requestId);
          if(!sender) return null;

          return (
            <li key={requestId} className='flex justify-between items-center mb-2'>
              <span>{sender?.pseudo ?? 'Utilisateur inconnu'}</span>
            <div className="space-x-2">
              <button onClick={() => handleRespond(sender?._id, 'accept')} className="bg-green-400 hover:underline cursor-pointer p-2 rounded-md">Accepter</button>
              <button onClick={() => handleRespond(sender?._id, 'reject')} className="bg-red-400 hover:underline cursor-pointer p-2 rounded-md">Refuser</button>
            </div>
            </li>
          );
        })}
        {friendRequests.length === 0 && <div className='w-full text-center font-medium'>You have not received any friend requests.</div>}
      </ul>
      </div>
      <Modal message="Request accepted" show={showModal} onClose={() => setShowModal(false)}/>
      <Modal message="Request rejected" show={showModalReject} onClose={() => setShowModalReject(false)}/>
      <Modal message="Request sent" show={showModalRequestSent} onClose={() => setShowModalRequestSent(false)}/>

 {/* List request sent */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Friend request sent </h2>
        <ul className="list-disc list-inside">
          {pendingFriendRequests?.map((request) => (
            <li key={request} className='flex justify-between w-72'>
              <div>{request}</div>
              <button onClick={() => handleCancelFriendRequest(request)} className='p-2 rounded-md bg-red-400'>Cancel request</button>
            </li>
          ))}
        </ul>
      {pendingFriendRequests.length === 0 && <div className='w-full text-center font-medium'>You haven't sent any friend requests.</div>}
      </div>

      {/* Liste d'amis */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your friends</h2>
        <ul className="list-disc list-inside w-full">
          {currentFriendsPseudos?.map((friend) => (
              <li className='text-black flex justify-around w-72 items-center gap-4 mb-2' key={friend}>
                <div>{friend}</div>
                <button className='p-2 bg-blue-300 hover:bg-blue-200 rounded-md cursor-pointer'>Send a message</button>
                <button className='p-2 bg-red-300 hover:bg-blue-200 rounded-md cursor-pointer'>Delete friend</button>
                
                </li>
          ))}
        </ul>
        {currentFriendsPseudos?.length === 0 && <div className='w-full text-center font-medium'>You don't have any friend for the moment.</div>}
      </div>
    </div>
  );
}
