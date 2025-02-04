"use client"

import { signOut } from "next-auth/react";

const SignOutButton = () => {
    return <button onClick={() => signOut()}>Odhlásit</button>;
};

export default SignOutButton;