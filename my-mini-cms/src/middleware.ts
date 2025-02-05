// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: '/api/auth/signin',
    },
});

// Only protect dashboard routes
export const config = {
    matcher: ["/dashboard/:path*"]
};