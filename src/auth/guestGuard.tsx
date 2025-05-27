'use client'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import Spinner from '@/component/Spinner';

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser()
    const router = useRouter()

    console.log('AuthGuard state:', { user, loading })

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard')
        }
    }, [loading, user, router])

    if (loading) {
        return <Spinner />
    }

    if (!user) {
        return null
    }
    
    return <>{children}</>
}

