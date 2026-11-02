"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import PageSpinner from "@/components/shared/page-spinner";
import { useSession } from "@/lib/auth-client";

export default function ProtectedRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending) {
    return <PageSpinner label="Checking your session..." />;
  }

  if (!session) {
    return <PageSpinner label="Redirecting to login..." />;
  }

  return children;
}
