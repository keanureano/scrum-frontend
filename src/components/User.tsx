"use client";

import { signOut, useSession } from "next-auth/react";

export function User() {
  const { data: session } = useSession();

  return (
    <>
      <button onClick={() => signOut()}>Log out</button>
      <pre>Client Session: {JSON.stringify(session)}</pre>
    </>
  );
}
