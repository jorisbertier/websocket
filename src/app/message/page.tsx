"use client"

import Modal from '@/component/Modal';
import { useUser } from '@/hooks/useUser';
import { useUsersList } from '@/hooks/useUsersList';
import { useEffect, useState } from 'react';
import { sendFriendRequest, respondToFriendRequest, cancelFriendRequest } from '../../api/api';
import useSocket from '@/hooks/useSocket';
import { useRef } from 'react';
import Image from 'next/image';


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

  const [pendingFriendRequests, setPendingFriendRequests] = useState<string[]>([]);

  /* CHAT Socket */
  const [chatFriend, setChatFriend] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<{from: string, text: string}[]>([]);
  const socketRef = useSocket(user?._id);

  
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socketRef.current) return;

    const handleIncomingMessage = ({ fromUserId, toUserId, message }: any) => {
      // On n’ajoute que si on est dans la bonne conversation
      if (fromUserId === chatFriend || toUserId === chatFriend) {
        setMessages(prev => [...prev, { from: fromUserId, text: message }]);
      }
    };

    socketRef.current.on('private_message', handleIncomingMessage);

    return () => {
      socketRef.current?.off('private_message', handleIncomingMessage);
    };
  }, [socketRef, chatFriend]);

  const handleSendMessage = () => {
    if (socketRef.current && chatFriend && user?._id) {
      socketRef.current.emit('private_message', {
        toUserId: chatFriend,
        fromUserId: user._id,
        message: chatMessage
      });

      setMessages(prev => [...prev, { from: user._id, text: chatMessage }]);
      setChatMessage('');
    }
  };

  const fetchMessages = async (friendId: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/messages/${user?._id}/${friendId}`);
      const data = await res.json();
      console.log('Message envoyé to ', friendId)
      setMessages(data);
    } catch (error) {
      console.error('Erreur lors du chargement des messages', error);
    }
  };

  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'auto' });
}, [messages]);

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

  const [conversations, setConversations] = useState<User[]>([]);

useEffect(() => {
  const fetchConversations = async () => {
    if (!user?._id) return;

    const res = await fetch(`http://localhost:3001/api/messages/conversations/${user._id}`);
    const interlocutorIds: string[] = await res.json();

    const convUsers = usersList.filter((u) => interlocutorIds.includes(u._id));
    console.log('con user', interlocutorIds)
    setConversations(convUsers);
  };

  fetchConversations();
}, [user, usersList]);

  return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Messagerie</h1>
//   {/* Section Ajout d'ami */}
//   <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto mb-10">
//         <h2 className="text-2xl font-semibold text-gray-700 mb-4">Rechercher un utilisateur</h2>
        
//         <div className="flex flex-col gap-4">
//           <input
//             type="text"
//             placeholder="Entrez un pseudo..."
//             value={newFriend}
//             onChange={handleSearchFriend}
//             className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />

//           {newFriend && (
//             <ul className="bg-gray-50 border border-gray-200 rounded-lg shadow-inner max-h-40 overflow-y-auto">
//               {filteredUsersList.length > 0 ? (
//                 filteredUsersList.map((friend) => (
//                   <li
//                     key={friend._id}
//                     className="px-4 py-2 hover:bg-blue-100 w-full transition-all"
//                   >
//                     <div className='w-full flex justify-between items-center py-2'>
//                       {/* <Image/> */}
//                       <span className='text-lg'>{friend?.pseudo}</span>
//                       <button aria-label='add a friend request' onClick={() => handleAddFriend(friend.pseudo)} className='bg-blue-300 cursor-pointer rounded-md w-8 h-8 flex justify-center items-center hover:bg-blue-200'>+</button>
//                     </div>
                    
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-4 py-2 text-gray-500 italic">Aucun utilisateur trouvé</li>
//               )}
//             </ul>
//           )}

//         </div>
//         </div>

//       {/*Demande recue d'amis*/}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Friend request received</h2>
//         <ul className="list-disc list-inside">
//         {friendRequests?.map((requestId: string) => {

//           const sender = usersList.find((u) => u._id === requestId);
//           if(!sender) return null;

//           return (
//             <li key={requestId} className='flex justify-between items-center mb-2'>
//               <span>{sender?.pseudo ?? 'Utilisateur inconnu'}</span>
//             <div className="space-x-2">
//               <button onClick={() => handleRespond(sender?._id, 'accept')} className="bg-green-400 hover:underline cursor-pointer p-2 rounded-md">Accepter</button>
//               <button onClick={() => handleRespond(sender?._id, 'reject')} className="bg-red-400 hover:underline cursor-pointer p-2 rounded-md">Refuser</button>
//             </div>
//             </li>
//           );
//         })}
//         {friendRequests.length === 0 && <div className='w-full text-center font-medium'>You have not received any friend requests.</div>}
//       </ul>
//       </div>
//       <Modal message="Request accepted" show={showModal} onClose={() => setShowModal(false)}/>
//       <Modal message="Request rejected" show={showModalReject} onClose={() => setShowModalReject(false)}/>
//       <Modal message="Request sent" show={showModalRequestSent} onClose={() => setShowModalRequestSent(false)}/>

//  {/* List request sent */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Friend request sent </h2>
//         <ul className="list-disc list-inside">
//           {pendingFriendRequests?.map((request) => (
//             <li key={request} className='flex justify-between w-72'>
//               <div>{request}</div>
//               <button onClick={() => handleCancelFriendRequest(request)} className='p-2 rounded-md bg-red-400'>Cancel request</button>
//             </li>
//           ))}
//         </ul>
//       {pendingFriendRequests.length === 0 && <div className='w-full text-center font-medium'>You haven't sent any friend requests.</div>}
//       </div>

//       {/* Liste d'amis */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="text-xl font-semibold mb-4">Your friends</h2>
//         <ul className="list-disc list-inside w-full">
//           {currentFriendsPseudos?.map((friend) => (
//               <li className='text-black flex justify-around w-72 items-center gap-4 mb-2' key={friend}>
//                 <div>{friend}</div>
//                 <button
//                   className='p-2 bg-blue-300 hover:bg-blue-200 rounded-md cursor-pointer'
//                   onClick={() => {
//                     const friendObj = usersList.find(u => u.pseudo === friend);
//                       const id = friendObj?._id || null;
//                       setMessages([]);
//                       setChatFriend(id);
//                       if (id) fetchMessages(id);
//                   }}
//                 >
//                   Send a message
//                 </button>
//                 <button className='p-2 bg-red-300 hover:bg-blue-200 rounded-md cursor-pointer'>Delete friend</button>
                
//                 </li>
//           ))}
//         </ul>
//         {currentFriendsPseudos?.length === 0 && <div className='w-full text-center font-medium'>You don't have any friend for the moment.</div>}
//         {chatFriend && (
//           <div className="bg-white p-4 mt-6 rounded shadow-md max-w-md mx-auto">
//             <h3 className="text-xl font-semibold mb-2">Chat with ${chatFriend} </h3>
//             <div className="border h-40 overflow-y-auto mb-2 p-2">
//               {messages.map((msg, idx) => (
//                 <div key={idx} className={`mb-1 ${msg.from === user?._id ? 'text-right' : 'text-left'}`}>
//                   {/* <span className="inline-block bg-gray-200 px-3 py-1 rounded">{msg.text}</span> */}
//                   <span className={`inline-block px-3 py-1 rounded ${msg.from === user?._id ? 'bg-blue-300' : 'bg-gray-200'}`}>{msg.text}</span>
//                 </div>
//               ))}
//               <div ref={bottomRef}></div>
//             </div>
//             <div className="flex gap-2">
//               <input
//                 className="border p-2 flex-1 rounded"
//                 placeholder="Message..."
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//               />
//               <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
//                 Envoyer
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="bg-white p-4 rounded shadow mb-6">
//       <h2 className="text-xl font-semibold mb-4">Your conversations</h2>
//       {conversations.length > 0 ? (
//         <ul className="space-y-2">
//           {conversations.map((convUser) => (
//             <li key={convUser._id} className="flex justify-between items-center">
//               <span>{convUser.pseudo}</span>
//               <button
//                 onClick={() => {
//                   setChatFriend(convUser._id);
//                   fetchMessages(convUser._id);
//                 }}
//                 className="text-blue-600 hover:underline"
//               >
//                 Open Chat
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-gray-500 italic">No active conversations.</p>
//       )}
//     </div>
//     </div>
<div className='h-screen flex'>
  <div className='w-1/5 bg-green-200 h-full'></div>

  <div className='h-full w-1/5 p-2 flex flex-col'>
    <h2 className='mt-4 flex justify-start font-semibold text-xl'>Live chat</h2>
    <div className='bg-[#f3f3f3] p-2 rounded-md w-auto my-4 flex relative'>
      <div className='absolute right-5 top-1/2 -translate-y-1/2'>
        <svg viewBox="0 0 24 24" width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#c7c7c7"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#c7c7c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
      </div>
      <input name="search" placeholder='search ...' className='w-full outline-none border-none p-1 rounded-md'/>
    </div>

    <article className=' bg-white w-full flex h-16 rounded-sm hover:bg-gray-200 duration-200 ease-in-out cursor-pointer'>
      <div className='w-16 h-16 flex justify-center items-center'>
        <div className="w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
          <Image width={20} height={20} className='w-full h-full rounded-[50%] object-cover' alt="image profile" src={'data:image/jpeg;base64,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'}/>
        </div>
      </div>
      <section className='flex flex-col justify-around w-full'>
        <header className='flex justify-between ml-2 mr-2'>
          <h3 className='font-semibold text-sm'>Jane Cooper</h3>
          <time className='text-gray-600 text-sm'>13:11</time>
        </header>
        <p className='ml-2 text-sm text-gray-500'>typing ...</p>
      </section>
    </article>

    <article className=' bg-white w-full flex h-16 rounded-sm hover:bg-gray-200 cursor-pointer'>
      <div className='w-16 h-16 flex justify-center items-center'>
        <div className="w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
          <Image width={20} height={20} className='w-full h-full rounded-[50%] object-cover' alt="image profile" src={'data:image/jpeg;base64,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'}/>
        </div>
      </div>
      <section className='flex flex-col justify-around w-full'>
        <header className='flex justify-between ml-2 mr-2'>
          <h3 className='font-semibold text-sm'>Jane Cooper</h3>
          <time className='text-gray-600 text-sm'>13:11</time>
        </header>
        <p className='ml-2 text-sm text-gray-500'>Thank you for information</p>
      </section>
    </article>

    <article className=' bg-white w-full flex h-16 rounded-sm hover:bg-gray-200 cursor-pointer'>
      <div className='w-16 h-16 flex justify-center items-center'>
        <div className="w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
          <Image width={20} height={20} className='w-full h-full rounded-[50%] object-cover' alt="image profile" src={'data:image/jpeg;base64,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'}/>
        </div>
      </div>
      <section className='flex flex-col justify-around w-full'>
        <header className='flex justify-between ml-2 mr-2'>
          <h3 className='font-semibold text-sm'>Jane Cooper</h3>
          <time className='text-gray-600 text-sm'>13:11</time>
        </header>
        <p className='ml-2 text-sm text-gray-500'>typing ...</p>
      </section>
    </article>

  </div>
  <div className='bg-blue-300 h-full w-3/5'></div>
</div>
  );
}
