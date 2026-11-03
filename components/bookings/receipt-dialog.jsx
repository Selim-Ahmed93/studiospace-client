"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatCurrency,
  formatDate,
  formatHours,
  formatTime,
} from "@/lib/format";

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function ReceiptDialog({ booking, studio, open, onOpenChange }) {
  if (!booking) return null;

  const bookingId = `#${String(booking._id || "")
    .slice(-6)
    .toUpperCase()}`;

  const location = [
    studio?.location?.address,
    studio?.location?.city,
    studio?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Booking receipt</DialogTitle>
          <DialogDescription>
            {bookingId} · {studio?.title || "Studio unavailable"}
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-border/70 rounded-xl border bg-muted/20 px-3">
          <ReceiptRow label="Status" value={booking.status} />
          {location ? <ReceiptRow label="Location" value={location} /> : null}
          <ReceiptRow label="Date" value={formatDate(booking.bookingDate)} />
          <ReceiptRow
            label="Time"
            value={`${formatTime(booking.startTime)} – ${formatTime(
              booking.endTime
            )}`}
          />
          <ReceiptRow
            label="Duration"
            value={formatHours(booking.totalHours)}
          />
          <ReceiptRow
            label="Hourly rate"
            value={formatCurrency(booking.hourlyRate)}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
          <span className="text-sm font-semibold text-brand-soft-foreground">
            Booking total
          </span>
          <span className="text-lg font-extrabold tracking-tight text-brand-strong">
            {formatCurrency(booking.totalAmount)}
          </span>
        </div>

        <p className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-5 text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          No payment has been processed. Payment for this booking is arranged
          directly with the host.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
