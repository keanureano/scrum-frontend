import { signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between px-4 py-2 border-b-2 bg-primary-200 border-primary-300">
      <div className="flex items-center gap-16">
        <Logo />
        <Navigation />
      </div>
      <div className="flex items-center">
        <button onClick={() => signOut()}>Log out</button>
      </div>
    </nav>
  );
}

export function Navigation() {
  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Dev",
      href: "/dev",
    },
    {
      name: "My Reports",
      href: "/my-reports",
    },
    {
      name: "Weekly Scrums",
      href: "/weekly-scrums",
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            className={`hover:underline decoration-2 ${
              isActive ? "underline text-amber-800" : ""
            }`}
            href={link.href}
            key={link.name}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}

function Logo() {
  return (
    <Link href="/">
      <Image src="/logo.png" width={128} height={128 / 4} alt="logo" />
    </Link>
  );
}
