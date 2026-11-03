"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  MapPin,
  ReceiptText,
  XCircle,
} from "lucide-react";

import ReceiptDialog from "@/components/bookings/receipt-dialog";
import SafeImage from "@/components/shared/safe-image";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80";

const STATUS_META = {
  Pending: {
    label: "Pending Host Approval",
    pill: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20",
    dot: "bg-amber-500",
  },
  Confirmed: {
    label: "Confirmed",
    pill: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    dot: "bg-emerald-500",
  },
  Completed: {
    label: "Completed",
    pill: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20",
    dot: "bg-sky-500",
  },
  Cancelled: {
    label: "Cancelled",
    pill: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20",
    dot: "bg-rose-500",
  },
};

function getStudio(booking) {
  return booking?.studioId && typeof booking.studioId === "object"
    ? booking.studioId
    : null;
}

function getBookingId(booking) {
  return `ID: ${String(booking?._id || "")
    .slice(-6)
    .toUpperCase()}`;
}

export default function BookingCard({ booking, onCancel, compact = false }) {
  const [receiptOpen, setReceiptOpen] = useState(false);

  const studio = getStudio(booking);
  const status = STATUS_META[booking?.status] || {
    label: booking?.status || "Unknown",
    pill: "bg-muted text-muted-foreground ring-border",
    dot: "bg-muted-foreground",
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card p-2.5">
        <SafeImage
          src={studio?.images?.[0] || PLACEHOLDER_IMAGE}
          alt={studio?.title || "Studio"}
          className="size-12 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold">
            {studio?.title || "Studio unavailable"}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {formatDate(booking.bookingDate)} ·{" "}
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </p>
        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
            status.pill
          )}
        >
          <span className={cn("size-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </div>
    );
  }

  const location =
    [studio?.location?.address, studio?.location?.city]
      .filter(Boolean)
      .join(", ") || "Location unavailable";

  const hours = Number(booking?.totalHours || 0);

  return (
    <article className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-[66px] sm:w-[92px]">
          <SafeImage
            src={studio?.images?.[0] || PLACEHOLDER_IMAGE}
            alt={studio?.title || "Studio"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                status.pill
              )}
            >
              <span className={cn("size-1.5 rounded-full", status.dot)} />
              {status.label}
            </span>

            <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {getBookingId(booking)}
            </span>
          </div>

          {studio?._id ? (
            <Link
              href={`/studios/${studio._id}`}
              className="mt-2 block text-[15px] font-bold tracking-tight transition-colors hover:text-brand-strong line-clamp-2 sm:line-clamp-1"
            >
              {studio.title}
            </Link>
          ) : (
            <p className="mt-2 text-[15px] font-bold tracking-tight">
              Studio unavailable
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] text-muted-foreground">
              <CalendarDays className="size-3" aria-hidden="true" />
              {formatDate(booking.bookingDate)}
            </span>

            <span className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-1.5 py-0.5 text-[11px] text-muted-foreground">
              <Clock className="size-3" aria-hidden="true" />
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </span>

            <span className="text-[11px] text-muted-foreground">
              {hours} {hours === 1 ? "hr" : "hrs"}
            </span>
          </div>

          <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{location}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t border-border/60 pt-3 sm:w-[12.5rem] sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Booking Total
            </p>
            <p className="mt-0.5 text-lg font-extrabold tracking-tight text-brand-strong">
              {formatCurrency(booking.totalAmount)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg px-2.5 text-xs"
              onClick={() => setReceiptOpen(true)}
            >
              <ReceiptText className="size-3.5" aria-hidden="true" />
              Receipt
            </Button>

            {booking.status === "Pending" && onCancel ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-rose-200 px-2.5 text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-400/30 dark:text-rose-400 dark:hover:bg-rose-400/10 dark:hover:text-rose-300"
                onClick={() => onCancel(booking)}
              >
                <XCircle className="size-3.5" aria-hidden="true" />
                Cancel Booking
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <ReceiptDialog
        booking={booking}
        studio={studio}
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
      />
    </article>
  );
}
