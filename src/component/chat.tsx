import { useEffect, useState } from "react";
import socket from "../lib/socket";
import { useUser } from "@/hooks/useUser";

interface User {
    username: string
}

export default function Chat({username}: User) {

    // const { user} = useUser()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    // const [username, setUsername] = useState(user?.email);

    useEffect(() => {
        socket.on("message", (msg) => {
        setMessages((prev) => [...prev, msg]);
        });

        return () => {
        socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() !== "") {
        socket.emit("message",  { text: input, username });
        setInput("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl font-semibold text-center mb-4 text-gray-800">
            💬 Chat en temps réel
            </h1>
            {messages.length > 0  && <div>{username}</div>}
            <div className="h-64 overflow-y-auto border rounded-md p-4 mb-4 bg-gray-50 space-y-2">
            {messages.map((msg, index) => (
                <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg w-fit max-w-full"
                >
                {msg.text}
                </div>
            ))}
            </div>

            <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tape ton message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                Envoyer
            </button>
            </div>
        </div>
        </div>
    );
}
