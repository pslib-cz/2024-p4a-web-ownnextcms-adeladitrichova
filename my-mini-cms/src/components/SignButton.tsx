"use client"

import { signIn, useSession } from "next-auth/react";

const SignButton = () => {
    const { data: session } = useSession();
    return session ? null : <button onClick={() => signIn("github")}>Přihlásit</button>
}

export default SignButton;