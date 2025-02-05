import { signOut } from "next-auth/react";
import { getAuthSession } from "@/libs/auth";

const LogoutButton = async () => {
    const session = await getAuthSession();

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