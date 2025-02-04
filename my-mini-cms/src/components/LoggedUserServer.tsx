import { signIn, auth } from "@/libs/auth";

const LoggedUserServer = async () => {
    const session = await auth();

  if (!session) {
      return (
          <form action={async () => {
              "use server"
              await signIn("github")
          }}
          >
              <button type="submit">Signin with GitHub</button>
          </form>
      );
  }
 <p>Logged in as {session.user!.email}</p>;
};

export default LoggedUserServer;