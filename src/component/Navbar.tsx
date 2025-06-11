"use client"

import Image from "next/image";
import Link from "next/link";

import { Button } from '../components/ui/button'
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";


function Navbar() {

    const { user, loading, setUser} = useUser();
    const router = useRouter();
    console.log("Navbar user: ", user);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if(response.ok) {
                console.log('Logout sucessfull')
                setUser(null)
                router.push('/')
            } else {
                console.log('Error durantly logout')
            }
        } catch(e) {
            console.log('Error durantly logout: ', e)
        }
    }
    
    return (
        <>
            <nav className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center">
                        <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                        <span className="text-xl font-bold">WebSocketApp</span>
                    </Link>
                </div>
                <div className="flex gap-4 items-center">
                {!user ? (
                    <>
                        <Link href="/">
                            <span className="hover:underline text-sm sm:text-base">Accueil</span>
                        </Link>
                        <Link href="/about">
                            <span className="hover:underline text-sm sm:text-base">À propos</span>
                        </Link>
                    </>
                ) : (
                    <>
                    <Link href="/message">message</Link>
                    </>
                )
            }
                {/* {!loading && ( */}
                {!loading && (
                    <Button asChild>
                        {user ? (
                        <button className="cursor-pointer" onClick={handleLogout}>Logout</button>
                        ) : (
                        <Link className="cursor-pointer" href="/login">Connexion</Link>
                        )}
                    </Button>
                    )}
        {/* )} */}
                </div>
            </nav>
        </>
    )
}

export default Navbar