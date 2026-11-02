"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Plus, RefreshCw, WifiOff } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import PageSpinner from "@/components/shared/page-spinner";
import MyListingCard from "@/components/studios/my-listing-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { deleteStudio, fetchAllStudios } from "@/services/studios";

export default function MyListings() {
  const { data: session } = useSession();
  const user = session?.user;

  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const allStudios = await fetchAllStudios();

        if (active) {
          setStudios(allStudios.filter((studio) => studio.ownerId === user.id));
        }
      } catch (requestError) {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load your listings right now. Please try again."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadStudios();

    return () => {
      active = false;
    };
  }, [user?.id, retryKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteStudio(deleteTarget._id);
      setStudios((current) =>
        current.filter((studio) => studio._id !== deleteTarget._id)
      );
      setDeleteTarget(null);
      toast.success("Studio removed from your listings.");
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(
          requestError,
          "Could not delete this studio. It may have existing bookings."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return <PageSpinner label="Loading your listings..." />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Host dashboard
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My listings
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Manage the spaces you host. Update details, adjust pricing, or
            remove a listing.
          </p>
        </div>

        <Link
          href="/add-studio"
          className={cn(buttonVariants(), "h-10 shrink-0")}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add studio
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border bg-muted/60"
              />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={WifiOff}
            title="Couldn't load your listings"
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
        ) : studios.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="You haven't listed a studio yet"
            description="Add your first space, set an hourly rate, and start receiving booking requests from creators."
            action={
              <Link href="/add-studio" className={cn(buttonVariants())}>
                <Plus className="size-4" aria-hidden="true" />
                List your studio
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {studios.map((studio) => (
              <MyListingCard
                key={studio._id}
                studio={studio}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete this studio?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. Listings with existing bookings cannot be deleted.`
            : ""
        }
        confirmLabel="Delete studio"
        destructive
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
