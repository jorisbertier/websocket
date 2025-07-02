"use client"

import React from 'react'

interface FriendRequestsSentProps {
    pendingFriendRequests: string[];
    handleCancelFriendRequest: (pseudo: string) => void;
}

const ListRequestSent: React.FC<FriendRequestsSentProps> = ({
    pendingFriendRequests,
    handleCancelFriendRequest,
}) => {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className='flex justify-between'>
                <h2 className="text-xl font-semibold mb-4">Friend request sent </h2>
                <span className="bg-blue-300 text-white text-sm font-bold w-7 h-7 flex justify-center items-center rounded-full">
                {pendingFriendRequests?.length}
                </span>
            </div>
            <ul className="list-disc list-inside">
                {pendingFriendRequests?.map((request) => (
                <li key={request} className='flex justify-between w-72'>
                    <div>{request}</div>
                    <button onClick={() => handleCancelFriendRequest(request)} className='p-2 rounded-md bg-red-400 cursor-pointer hover:bg-red-200'>Cancel request</button>
                </li>
                ))}
            </ul>
            {pendingFriendRequests.length === 0 && <div className='w-full text-center'>You haven't sent any friend requests.</div>}
        </div>
    )
}

export default ListRequestSent