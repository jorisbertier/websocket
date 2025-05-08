'use client'

import { Button } from '@/components/ui/button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

    const router = useRouter()


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
        e.preventDefault()
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('http://localhost:3001/api/register', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            const data = await res.json();
            if (!res.ok) {
                console.log(data)
                setErrors(data.errors);
                return;
            }
            setErrors({})

            console.log('User registered successfully:', data);
            router.push('/login?creation=true');

        } catch(e) {
            console.log('Error registration: ', e)
        }
    } 

    return (
        <div className="flex-1 flex items-center justify-center bg-red-50 px-4 h-full">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create an account</h2>

            <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
                </label>
                <input
                type="text"
                name="name"
                id="name"
                required
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
                </label>
                <input
                type="text"
                name="email"
                id="email"
                required
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                />
            {errors.email &&(
                <span className='text-red-500 -mt-10 text-sm'>{errors.email}</span>
            )}
            </div>

            {/* Password */}
            <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                type="password"
                name="password"
                id="password"
                required
                onChange={handleChange}
                className="mt-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full bg-black text-white hover:bg-blue-600">
                Sign Up
            </Button>
            </form>

            {/* Link to login */}
            <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:text-blue-700">
                Log in
            </a>
            </p>
        </div>
        </div>
    );
}