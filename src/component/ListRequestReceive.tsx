"use client"
import { User } from '@/interface/interface';
import React from 'react'

interface FriendRequestsReceivedProps {
    friendRequests: string[];
    usersList: User[];
    handleRespond: (userId: string, action: 'accept' | 'reject') => void;
}


const ListRequestReceive: React.FC<FriendRequestsReceivedProps> = ({
    friendRequests,
    usersList,
    handleRespond,
}) => {
    return (
        <div className="bg-white p-4 rounded shadow">
        <div className='flex justify-between'>
            <h2 className="text-xl font-semibold mb-4">Friend request received </h2>
            <span className="bg-blue-300 text-white text-sm font-bold w-7 h-7 flex justify-center items-center rounded-full">
                {friendRequests?.length}
            </span>
            </div>
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
                {friendRequests.length === 0 && <div className='w-full text-center'>You have not received any friend requests.</div>}
            </ul>
        </div>
    )
}

export default ListRequestReceive