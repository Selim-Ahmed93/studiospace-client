"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, RefreshCw, WifiOff } from "lucide-react";

import EmptyState from "@/components/shared/empty-state";
import PageSpinner from "@/components/shared/page-spinner";
import StudioForm from "@/components/studios/studio-form";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { fetchStudio } from "@/services/studios";

export default function EditStudio({ studioId }) {
  const { data: session } = useSession();
  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStudio() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchStudio(studioId);

        if (active) setStudio(result);
      } catch (requestError) {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load this studio right now. Please try again."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudio();

    return () => {
      active = false;
    };
  }, [studioId, retryKey]);

  if (loading) {
    return <PageSpinner label="Loading studio details..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={WifiOff}
        title="Couldn't load this studio"
        description={error}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => setRetryKey((key) => key + 1)}
          >
            <RefreshCw className="size-4" aria-hidden="true" />
            Try again
          </Button>
        }
      />
    );
  }

  if (!studio) {
    return (
      <EmptyState
        icon={Building2}
        title="Studio not found"
        description="This listing may have been removed, or the link is incorrect."
        action={
          <Link href="/my-listings" className={cn(buttonVariants())}>
            Back to my listings
          </Link>
        }
      />
    );
  }

  if (session?.user?.id !== studio.ownerId) {
    return (
      <EmptyState
        icon={Building2}
        title="You can't edit this studio"
        description="Only the host who created this listing can edit it."
        action={
          <Link href="/my-listings" className={cn(buttonVariants())}>
            Back to my listings
          </Link>
        }
      />
    );
  }

  return (
    <StudioForm mode="edit" initialStudio={studio} studioId={studioId} />
  );
}
