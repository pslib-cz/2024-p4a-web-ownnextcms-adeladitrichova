// src/middleware.ts
import { auth } from "@/libs/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

    if (isOnDashboard && !isLoggedIn) {
        return Response.redirect(new URL('/api/auth/signin', req.nextUrl))
    }

    return null
})

// Optionally configure middleware matcher
export const config = {
    matcher: ['/dashboard/:path*']
}