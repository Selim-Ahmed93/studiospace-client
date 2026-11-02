"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronRight,
  Clock,
  Plus,
  RefreshCw,
  Sparkles,
  WifiOff,
} from "lucide-react";

import BookingCard from "@/components/bookings/booking-card";
import EmptyState from "@/components/shared/empty-state";
import PageSpinner from "@/components/shared/page-spinner";
import SafeImage from "@/components/shared/safe-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { useSession } from "@/lib/auth-client";
import { formatCurrency, getTodayISODate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { fetchMyBookings } from "@/services/bookings";
import { fetchAllStudios } from "@/services/studios";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80";

export default function Dashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const [allStudios, myBookings] = await Promise.all([
          fetchAllStudios(),
          fetchMyBookings(),
        ]);

        if (active) {
          setListings(
            allStudios.filter((studio) => studio.ownerId === user.id)
          );
          setBookings(myBookings);
        }
      } catch (requestError) {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load your dashboard right now. Please try again."
            )
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [user?.id, retryKey]);

  if (!user) {
    return <PageSpinner label="Loading your dashboard..." />;
  }

  const firstName = user.name?.split(" ")[0] || "there";
  const today = getTodayISODate();
  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending"
  );
  const upcomingBookings = bookings.filter((booking) => {
    if (!["Pending", "Confirmed"].includes(booking.status)) return false;

    return (
      new Date(booking.bookingDate).toISOString().slice(0, 10) >= today
    );
  });

  const stats = [
    {
      label: "My listings",
      value: listings.length,
      description: "Spaces you host",
      icon: Building2,
      href: "/my-listings",
    },
    {
      label: "Pending requests",
      value: pendingBookings.length,
      description: "Waiting for a host decision",
      icon: Clock,
      href: "/my-bookings",
    },
    {
      label: "Upcoming bookings",
      value: upcomingBookings.length,
      description: "Pending or confirmed",
      icon: CalendarDays,
      href: "/my-bookings",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Dashboard
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Here&apos;s a quick look at your spaces and booking requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/add-studio"
            className={cn(buttonVariants(), "h-10 shrink-0")}
          >
            <Plus className="size-4" aria-hidden="true" />
            Add studio
          </Link>
          <Link
            href="/studios"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 shrink-0"
            )}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Explore studios
          </Link>
        </div>
      </div>

      {loading ? (
        <PageSpinner label="Loading your dashboard..." />
      ) : error ? (
        <div className="mt-10">
          <EmptyState
            icon={WifiOff}
            title="Couldn't load your dashboard"
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
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.label}
                  href={stat.href}
                  className="group rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <ChevronRight
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="mt-4 text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold">{stat.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Your listings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The spaces you currently host.
                  </p>
                </div>
                <Link
                  href="/my-listings"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5"
                >
                  View all
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-5">
                {listings.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center">
                    <Building2
                      className="mx-auto size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-semibold">
                      No listings yet
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      Add a studio to start receiving booking requests.
                    </p>
                    <Link
                      href="/add-studio"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "mt-4 h-9"
                      )}
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      Add studio
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {listings.slice(0, 3).map((studio) => (
                      <Link
                        key={studio._id}
                        href={`/studios/edit/${studio._id}`}
                        className="flex items-center gap-3 rounded-xl border bg-background p-3 transition-colors hover:border-primary/30 hover:bg-muted/40"
                      >
                        <SafeImage
                          src={studio.images?.[0] || PLACEHOLDER_IMAGE}
                          alt={studio.title}
                          className="size-14 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {studio.title}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {studio.category} ·{" "}
                            {formatCurrency(studio.hourlyRate)} / hr
                          </p>
                        </div>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    Recent bookings
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your latest studio requests.
                  </p>
                </div>
                <Link
                  href="/my-bookings"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5"
                >
                  View all
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="mt-5">
                {bookings.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-muted/30 px-5 py-8 text-center">
                    <CalendarDays
                      className="mx-auto size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-sm font-semibold">
                      No bookings yet
                    </p>
                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      Find a space for your next shoot, recording, or workshop.
                    </p>
                    <Link
                      href="/studios"
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "mt-4 h-9"
                      )}
                    >
                      Explore studios
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 3).map((booking) => (
                      <BookingCard
                        key={booking._id}
                        booking={booking}
                        compact
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
