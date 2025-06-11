'use client'
import React, { useEffect, useState } from 'react'

type NotificationModalProps = {
    message: string;
    show: boolean;
    onClose: () => void;
};



function Modal({ message, show, onClose }: NotificationModalProps) {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
    if (show) {
        setIsVisible(true);
        const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
        }, 2000);
        return () => clearTimeout(timer);
    }
    }, [show, onClose]);

    if (!isVisible) return null;

    return (
        <div className="absolute  bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-lg rounded-lg w-80 p-4">
            <div className='flex w-full justify-between'>
                <p className="text-gray-800">{message}</p>
                { message === "Request rejected" ? (
                <svg fill="#fb1313" width={30} height={30} viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" stroke="#fb1313"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M114,100l49-49a9.9,9.9,0,0,0-14-14L100,86,51,37A9.9,9.9,0,0,0,37,51l49,49L37,149a9.9,9.9,0,0,0,14,14l49-49,49,49a9.9,9.9,0,0,0,14-14Z"></path></g></svg>
                ) : (
                <svg viewBox="0 0 24 24" width={30} height={30} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#9bed64"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fillRule="evenodd" clipRule="evenodd" d="M21.007 8.27C22.194 9.125 23 10.45 23 12c0 1.55-.806 2.876-1.993 3.73.24 1.442-.134 2.958-1.227 4.05-1.095 1.095-2.61 1.459-4.046 1.225C14.883 22.196 13.546 23 12 23c-1.55 0-2.878-.807-3.731-1.996-1.438.235-2.954-.128-4.05-1.224-1.095-1.095-1.459-2.611-1.217-4.05C1.816 14.877 1 13.551 1 12s.816-2.878 2.002-3.73c-.242-1.439.122-2.955 1.218-4.05 1.093-1.094 2.61-1.467 4.057-1.227C9.125 1.804 10.453 1 12 1c1.545 0 2.88.803 3.732 1.993 1.442-.24 2.956.135 4.048 1.227 1.093 1.092 1.468 2.608 1.227 4.05Zm-4.426-.084a1 1 0 0 1 .233 1.395l-5 7a1 1 0 0 1-1.521.126l-3-3a1 1 0 0 1 1.414-1.414l2.165 2.165 4.314-6.04a1 1 0 0 1 1.395-.232Z" fill="#9bed64"></path></g></svg>
                )}        
                </div>
            <div className="relative h-1 bg-gray-200 mt-4 rounded overflow-hidden">
                <div className={`absolute top-0 left-0 h-full ${message === "Request rejected" ? "bg-red-400" : "bg-green-500"} progress-bar`}></div>
            </div>
        </div>
    );
};

export default Modal