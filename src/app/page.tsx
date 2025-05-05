
import Link from "next/link";
import { Button } from '../components/ui/button'


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-4xl sm:text-6xl font-bold mb-6">Bienvenue sur WebSocketApp</h1>
        <p className="text-lg sm:text-xl mb-8 max-w-xl">
          Un projet en temps réel propulsé par WebSocket, Express, et Next.js.
        </p>
        <Button size="lg" asChild>
          <Link href="/chat">Accéder au chat</Link>
        </Button>
      </main>
    </div>
  );
}