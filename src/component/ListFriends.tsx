"use client"
import React from 'react';
import { Message } from '@/interface/interface';

interface FriendListProps {
    currentFriendsPseudos?: (string | undefined)[]
    usersList: { pseudo: string; _id: string }[];
    setChatFriend: (id: string | null) => void;
    setMessages: (messages: Message[]) => void;
    fetchMessages: (id: string) => void;
}


const ListFriends: React.FC<FriendListProps> = ({
    currentFriendsPseudos,
    usersList,
    setChatFriend,
    setMessages,
    fetchMessages,
}) => {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className='flex justify-between'>
            <h2 className="text-xl font-semibold mb-4">Your friends</h2>
            <span className="bg-blue-300 text-white text-sm font-bold w-7 h-7 flex justify-center items-center rounded-full">
                {currentFriendsPseudos?.length}
            </span>
            </div>
            <ul className="list-disc list-inside w-full">
            {currentFriendsPseudos?.slice(0, 5).map((friend) => (
                <li className='text-black flex justify-around w-72 items-center gap-4 mb-2' key={friend}>
                <div className='w-20 overflow-y-hidden'>{friend?.slice(0, 10)}</div>
                <button
                    className='p-2 bg-blue-300 hover:bg-blue-200 rounded-md cursor-pointer transition-colors durantion-300 ease-in-out'
                    onClick={() => {
                    const friendObj = usersList.find(u => u.pseudo === friend);
                        const id = friendObj?._id || null;
                        setMessages([]);
                        setChatFriend(id);
                        if (id) fetchMessages(id);
                    }}
                >
                    Send a message
                </button>
                <button className='p-2 bg-red-400 hover:bg-red-200 rounded-md cursor-pointer transition-colors durantion-300 ease-in-out'>Delete friend</button>
                
                </li>
                ))}
            </ul>
        </div>
    )
}

export default ListFriends