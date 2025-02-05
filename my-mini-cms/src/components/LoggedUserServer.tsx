import { signIn } from "next-auth/react";
import { getAuthSession } from "@/libs/auth";

const LoggedUserServer = async () => {
    const session = await getAuthSession();

    if (!session) {
        return (
            <form action={async () => {
                "use server"
                await signIn("github");
            }}>
                <button type="submit">Sign in with GitHub</button>
            </form>
        );
    }

    return <p>Logged in as {session.user!.email}</p>;
};

export default LoggedUserServer;