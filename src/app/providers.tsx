"use client";

import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export const LayoutProvider = ({ children }: Props) => {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
