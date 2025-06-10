'use client'

import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function LoginPage() {

    const [ email, setName] = useState('')
    const [ password, setPassword] = useState('')
    const searchParams = useSearchParams()
    const [showMessage, setShowMessage] = useState(false)
    const [ error, setError] = useState('');
    const router = useRouter();

    const { setUser, refreshUser } = useUser();

    useEffect(() => {
        if(searchParams.get('creation') === 'true') {
            setShowMessage(true)
            setTimeout(() => setShowMessage(false), 4000)
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/api/login', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password})
            })
            const data = await res.json();
            // console.log('daata', data.message)
            if (!res.ok) {
                console.error('Erreur de login:', data.message || data.errors);
                setError(data.message)
                return;
            }
            setError('')
            setUser(data.user)
            console.log('Login done !', data);
            // const idUser = data.user._id;
            refreshUser(); 
            router.push(`/dashboard`);
        } catch(e) {
            console.log('Error durantly connexion', e)
        }
    }

    return (
            <div className="flex-1 flex flex-col relative justify-center items-center h-full bg-red-50">
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
                    {error && (
                        <span className='text-red-400 text-sm'>{error}</span>
                    )}
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
                {showMessage && (
                <div className="p-4 absolute bottom-4">
                    <div className="mb-4 p-3 bg-green-100 text-green-500 rounded">
                        Registration successfully !
                    </div>
                </div>
                )}
            </div>
    );
}