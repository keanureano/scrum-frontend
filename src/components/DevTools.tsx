import api from "@/lib/axiosApi";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function DevTools() {
  const session = await getServerSession(authOptions);
  const { data } = await api.get("/");

  return (
    <>
      <Link href="/api/auth/signout">Log out</Link>
      <p>Server Session: {JSON.stringify(session)}</p>
      <p>API Data: {JSON.stringify(data)}</p>
    </>
  );
}
