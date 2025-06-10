'use client'

import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import Spinner from '@/component/Spinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser()
    const router = useRouter()

    // console.log('AuthGuard state:', { user, loading })

    useEffect(() => {
        if (!loading && !user) {
            // console.log('effectue le guard')
            router.push('/login')
        }
    }, [loading, user, router])

    if (loading || !user) {
        return <Spinner />
    }

    return <>{children}</>
}

