"use client"
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Loader from "@/components/loader";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const privateData = useQuery(orpc.privateData.queryOptions());

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Show loading while session is being fetched
  if (isPending) {
    return <Loader />;
  }

  // Don't render anything if no session (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <p>privateData: {privateData.data?.message}</p>
    </div>
  );
}
