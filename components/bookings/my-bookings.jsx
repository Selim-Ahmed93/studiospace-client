"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  RefreshCw,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

import BookingCard from "@/components/bookings/booking-card";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import PageSpinner from "@/components/shared/page-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { cancelBooking, fetchMyBookings } from "@/services/bookings";

const statusFilters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

export default function MyBookings() {
  const { data: session } = useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchMyBookings();

        if (active) setBookings(result);
      } catch (requestError) {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load your bookings right now. Please try again."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [user?.id, retryKey]);

  const handleCancel = async () => {
    if (!cancelTarget) return;

    setCancelling(true);

    try {
      const updated = await cancelBooking(cancelTarget._id);

      setBookings((current) =>
        current.map((booking) =>
          booking._id === cancelTarget._id
            ? { ...booking, ...updated }
            : booking
        )
      );
      setCancelTarget(null);
      toast.success("Booking request cancelled.");
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(
          requestError,
          "Could not cancel this booking. Please try again."
        )
      );
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    return <PageSpinner label="Loading your bookings..." />;
  }

  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter);

  const counts = bookings.reduce(
    (result, booking) => {
      result[booking.status] = (result[booking.status] || 0) + 1;
      return result;
    },
    { All: bookings.length }
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Creator dashboard
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            My bookings
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Track every request you&apos;ve sent, from pending approval to
            confirmed sessions.
          </p>
        </div>

        <Link
          href="/studios"
          className={cn(buttonVariants(), "h-10 shrink-0")}
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Explore studios
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <PageSpinner label="Loading your bookings..." />
        ) : error ? (
          <EmptyState
            icon={WifiOff}
            title="Couldn't load your bookings"
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
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No bookings yet"
            description="Find a space for your next shoot, recording, or workshop, and send your first request."
            action={
              <Link href="/studios" className={cn(buttonVariants())}>
                Explore studios
                <Sparkles className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveFilter(status)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    activeFilter === status
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                  aria-pressed={activeFilter === status}
                >
                  {status}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold",
                      activeFilter === status
                        ? "bg-primary-foreground/20"
                        : "bg-muted"
                    )}
                  >
                    {counts[status] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {filteredBookings.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title={`No ${activeFilter.toLowerCase()} bookings`}
                  description="Try another status filter to see the rest of your booking history."
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveFilter("All")}
                    >
                      Show all bookings
                    </Button>
                  }
                />
              ) : (
                filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    onCancel={setCancelTarget}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        title="Cancel this booking request?"
        description={
          cancelTarget
            ? `Your request for ${new Date(
                cancelTarget.bookingDate
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })} will be cancelled. You can send a new request later.`
            : ""
        }
        confirmLabel="Cancel request"
        cancelLabel="Keep booking"
        destructive
        loading={cancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
