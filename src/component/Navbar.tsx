import Image from "next/image";
import Link from "next/link";

import { Button } from '../components/ui/button'


function Navbar() {


    
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
                <Link href="/">
                    <span className="hover:underline text-sm sm:text-base">Accueil</span>
                </Link>
                <Link href="/about">
                    <span className="hover:underline text-sm sm:text-base">À propos</span>
                </Link>
                <Button asChild>
                    <Link href="/login">Connexion</Link>
                </Button>
                </div>
            </nav>
        </>
    )
}

export default Navbar