import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées => besoin d'être connecté
const protectedPaths = ['/dashboard', '/profile']

// Routes « invitées » => accès uniquement si pas connecté
const guestPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value

  // Si l'utilisateur est connecté (token présent)
  if (token) {
    // Empêcher l'accès aux pages invités (/login, /register)
    if (guestPaths.some(path => pathname.startsWith(path))) {
      // Rediriger vers dashboard
      const dashboardUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // Pour les autres routes, laisser passer
    return NextResponse.next()
  }

  // Si l'utilisateur n'est pas connecté (pas de token)
  // Empêcher l'accès aux routes protégées
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // Rediriger vers login
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Sinon laisser passer (routes publiques)
  return NextResponse.next()
}
