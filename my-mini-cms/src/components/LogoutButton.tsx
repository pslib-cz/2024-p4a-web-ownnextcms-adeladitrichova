import { signOut, auth } from "../libs/auth";

const LogoutButton = async () => {
    const session = await auth();

  if (session) {
      return (
          <form action={async () => {
              "use server"
              await signOut()
          }}
          >
              <button type="submit">Odhlásit se</button>
          </form>
      );
  }

  return null;
};

export default LogoutButton;