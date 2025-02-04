"use client"

import { useSession } from "next-auth/react";

const LoggedUser = () => {
    const { data: session } = useSession();
    return session ? <>{session.user!.email}</> : <>Nepřihlášený uživatel</>
}

export default LoggedUser;