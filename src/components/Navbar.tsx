import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="space-x-4">
      <Link href="/">Home</Link>
      <Link href="/dev">Dev</Link>
      <button onClick={() => signOut()}>Log out</button>
    </nav>
  );
}
