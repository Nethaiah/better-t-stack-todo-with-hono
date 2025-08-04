"use client";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";
import Loader from "./loader";
import UserMenu from "./user-menu";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show loading while session is being fetched
  if (isPending) {
    return <Loader />;
  }

  const links = [
    { to: "/", label: "Home" },
    // Only show dashboard and todos if user is authenticated
    ...(session ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/todos", label: "Todos" },
    ] : []),
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
