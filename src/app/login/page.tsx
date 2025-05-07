'use client'

import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useState } from 'react';

export default function LoginPage() {

    const [ email, setName] = useState('')
    const [ password, setPassword] = useState('')

    const handleLogin = (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        console.log(email)
        console.log(password)
    }

    return (
        <div className="flex-1 flex flex-col justify-center items-center h-full bg-red-50">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
            <form onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
                </div>
    
                {/* Password Input */}
                <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />
                </div>
    
                <Button size="lg" type="submit" className="w-full bg-black text-white hover:bg-blue-600">
                Login
                </Button>
            </form>
    
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-500 hover:text-blue-700">
                    Sign up
                </Link>
                </p>
            </div>
            </div>
            <div className="p-4">
        <div className="mb-4 p-3 bg-green-100 text-green-500 rounded">
            Registration successfully !
        </div>
      {/* Ton formulaire de login ici */}
    </div>
        </div>
    );
}