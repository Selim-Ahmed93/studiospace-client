"use client";

import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  XCircle,
} from "lucide-react";

import SafeImage from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { BOOKING_STATUS_STYLES } from "@/lib/constants";
import {
  formatCurrency,
  formatDate,
  formatHours,
  formatTime,
} from "@/lib/format";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80";

function getStudio(booking) {
  return booking?.studioId && typeof booking.studioId === "object"
    ? booking.studioId
    : null;
}

export default function BookingCard({ booking, onCancel, compact = false }) {
  const studio = getStudio(booking);
  const statusStyle =
    BOOKING_STATUS_STYLES[booking?.status] ||
    "bg-muted text-muted-foreground ring-border";

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border bg-card p-3">
        <SafeImage
          src={studio?.images?.[0] || PLACEHOLDER_IMAGE}
          alt={studio?.title || "Studio"}
          className="size-14 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {studio?.title || "Studio unavailable"}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {formatDate(booking.bookingDate)} ·{" "}
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </p>
        </div>

        <Badge className={cn("shrink-0 border-0", statusStyle)}>
          {booking.status}
        </Badge>
      </div>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 bg-muted sm:aspect-auto sm:w-56">
          <SafeImage
            src={studio?.images?.[0] || PLACEHOLDER_IMAGE}
            alt={studio?.title || "Studio"}
            className="h-full w-full object-cover"
          />

          <Badge
            className={cn(
              "absolute left-3 top-3 border-0 shadow-sm",
              statusStyle
            )}
          >
            {booking.status}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {studio?._id ? (
                <Link
                  href={`/studios/${studio._id}`}
                  className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors hover:text-primary"
                >
                  {studio.title}
                </Link>
              ) : (
                <p className="text-lg font-semibold">Studio unavailable</p>
              )}

              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">
                  {[studio?.location?.city, studio?.location?.country]
                    .filter(Boolean)
                    .join(", ") || "Location unavailable"}
                </span>
              </p>
            </div>

            <p className="shrink-0 text-lg font-bold tracking-tight">
              {formatCurrency(booking.totalAmount)}
            </p>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {formatDate(booking.bookingDate)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)} ·{" "}
              {formatHours(booking.totalHours)}
            </span>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            {studio?._id ? (
              <Link
                href={`/studios/${studio._id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9"
                )}
              >
                View studio
              </Link>
            ) : null}

            {booking.status === "Pending" && onCancel ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground hover:text-destructive"
                onClick={() => onCancel(booking)}
              >
                <XCircle className="size-4" aria-hidden="true" />
                Cancel request
              </Button>
            ) : null}

            <span className="ml-auto text-xs text-muted-foreground">
              {formatCurrency(booking.hourlyRate)} / hour
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
