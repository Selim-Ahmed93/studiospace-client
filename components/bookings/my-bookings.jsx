"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CalendarRange,
  RefreshCw,
  Sparkles,
  WifiOff,
} from "lucide-react";
import { toast } from "sonner";

import BookingCard from "@/components/bookings/booking-card";
import ConfirmDialog from "@/components/shared/confirm-dialog";
import EmptyState from "@/components/shared/empty-state";
import PageSpinner from "@/components/shared/page-spinner";
import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { cancelBooking, fetchMyBookings } from "@/services/bookings";

const statusFilters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

const brandButtonClass =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40";

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
    <div className="mx-auto w-full max-w-[47.5rem] px-4 pb-16 pt-10 sm:px-6 lg:pt-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-soft-foreground ring-1 ring-brand/20">
            <CalendarRange className="size-3" aria-hidden="true" />
            Production Schedule
          </span>

          <h1 className="mt-3 text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.15rem]">
            My Studio Bookings
          </h1>

          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Track reservation statuses, cancellation requests, and shoot times.
          </p>
        </div>

        <Link href="/studios" className={cn(brandButtonClass, "sm:mt-10")}>
          Explore More Studios
          <ArrowRight className="size-4" aria-hidden="true" />
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
              <Link href="/studios" className={brandButtonClass}>
                Explore studios
                <Sparkles className="size-4" aria-hidden="true" />
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-1.5">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setActiveFilter(status)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    activeFilter === status
                      ? "bg-brand-soft text-brand-soft-foreground ring-1 ring-brand/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-pressed={activeFilter === status}
                >
                  {status}
                  <span
                    className={cn(
                      "rounded-full px-1 text-[9px] font-bold",
                      activeFilter === status
                        ? "bg-brand/15 text-brand-soft-foreground"
                        : "bg-muted"
                    )}
                  >
                    {counts[status] || 0}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-3">
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
