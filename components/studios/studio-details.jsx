"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import SafeImage from "@/components/shared/safe-image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  formatCurrency,
  formatDate,
  formatHours,
  formatTime,
  getDurationHours,
  getInitials,
  getTodayISODate,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/services/bookings";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80";

export default function StudioDetails({ studio }) {
  const router = useRouter();
  const { data: session } = useSession();

  const images = studio.images?.length ? studio.images : [PLACEHOLDER_IMAGE];
  const [activeImage, setActiveImage] = useState(images[0]);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedRequest, setConfirmedRequest] = useState(null);

  const isOwner = Boolean(
    session?.user?.id && studio.ownerId === session.user.id
  );
  const rating = Number(studio.rating || 0);
  const duration = getDurationHours(startTime, endTime);
  const estimatedTotal = duration * Number(studio.hourlyRate || 0);
  const today = getTodayISODate();

  const handleBook = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!session?.user) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`
      );
      return;
    }

    if (isOwner) {
      setFormError("You cannot book your own studio.");
      return;
    }

    if (!bookingDate) {
      setFormError("Choose a booking date.");
      return;
    }

    if (bookingDate < today) {
      setFormError("Choose today or a future date.");
      return;
    }

    if (!startTime || !endTime) {
      setFormError("Choose a start and end time.");
      return;
    }

    if (duration < 1) {
      setFormError("Bookings must be at least one hour long.");
      return;
    }

    setSubmitting(true);

    try {
      const booking = await createBooking({
        studioId: studio._id,
        bookingDate,
        startTime,
        endTime,
      });

      setConfirmedRequest(booking);
      toast.success("Booking request sent. The host will confirm it.");
      router.refresh();
    } catch (requestError) {
      const message = getApiErrorMessage(
        requestError,
        "Could not send your booking request. Please try again."
      );

      if (requestError?.response?.status === 401) {
        router.push(
          `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`
        );
        return;
      }

      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <nav
        className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <Link href="/studios" className="hover:text-foreground">
          Studios
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="line-clamp-1 text-foreground">{studio.title}</span>
      </nav>

      <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{studio.category}</Badge>
            <span className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs font-medium">
              <Star
                className="size-3.5 fill-amber-400 text-amber-500"
                aria-hidden="true"
              />
              {rating > 0 ? `${rating.toFixed(1)} / 5` : "New listing"}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {studio.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {[studio.location?.address, studio.location?.city, studio.location?.country]
                .filter(Boolean)
                .join(", ")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              Up to {studio.maxCapacity} people
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {formatCurrency(studio.hourlyRate)} / hour
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded-xl border bg-card px-4 py-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {getInitials(studio.ownerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs text-muted-foreground">Hosted by</p>
            <p className="text-sm font-semibold">{studio.ownerName}</p>
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <SafeImage
              src={activeImage}
              alt={studio.title}
              className="aspect-[16/10] h-full w-full object-cover"
            />
          </div>

          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {images.slice(0, 5).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "overflow-hidden rounded-lg border-2 transition-colors",
                    activeImage === image
                      ? "border-primary"
                      : "border-transparent hover:border-primary/40"
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={activeImage === image}
                >
                  <SafeImage
                    src={image}
                    alt={`${studio.title} preview ${index + 1}`}
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <section className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold tracking-tight">
              About this space
            </h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">
              {studio.overview || "The host has not added an overview yet."}
            </p>
          </section>

          <section className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold tracking-tight">Amenities</h2>

            {studio.amenities?.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 text-sm"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" aria-hidden="true" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                The host has not listed amenities yet.
              </p>
            )}
          </section>

          <section className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold tracking-tight">Reviews</h2>

            {rating > 0 ? (
              <div className="mt-4 rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-2">
                  <Star
                    className="size-5 fill-amber-400 text-amber-500"
                    aria-hidden="true"
                  />
                  <span className="text-2xl font-bold">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">out of 5</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  This studio has a rating from previous guests.
                </p>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed bg-muted/30 px-6 py-10 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-foreground/10">
                  <Star className="size-5" aria-hidden="true" />
                </span>
                <p className="mt-4 font-semibold">No reviews yet</p>
                <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
                  Be the first to book this space and share your experience
                  with the StudioSpace community.
                </p>
              </div>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-2xl font-bold tracking-tight">
                  {formatCurrency(studio.hourlyRate)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / hour
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Minimum booking: 1 hour
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium">
                <Star
                  className="size-4 fill-amber-400 text-amber-500"
                  aria-hidden="true"
                />
                {rating > 0 ? rating.toFixed(1) : "New"}
              </span>
            </div>

            <div className="my-5 h-px bg-border" />

            {confirmedRequest ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    <Check className="size-4" aria-hidden="true" />
                    Booking request sent
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700/80 dark:text-emerald-300/80">
                    The host will review your request. You can track its status
                    in My Bookings.
                  </p>
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium">
                      {formatDate(confirmedRequest.bookingDate)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="font-medium">
                      {formatTime(confirmedRequest.startTime)} –{" "}
                      {formatTime(confirmedRequest.endTime)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-semibold">
                      {formatCurrency(confirmedRequest.totalAmount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <Badge variant="secondary">
                        {confirmedRequest.status}
                      </Badge>
                    </dd>
                  </div>
                </dl>

                <Link
                  href="/my-bookings"
                  className={cn(buttonVariants(), "h-10 w-full")}
                >
                  View my bookings
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setConfirmedRequest(null)}
                >
                  Book another time
                </Button>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="booking-date">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    Booking date
                  </Label>
                  <Input
                    id="booking-date"
                    type="date"
                    min={today}
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    className="h-10"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start</Label>
                    <Input
                      id="start-time"
                      type="time"
                      step="900"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End</Label>
                    <Input
                      id="end-time"
                      type="time"
                      step="900"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                      className="h-10"
                      required
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-muted/60 p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {duration > 0
                        ? `${formatHours(duration)} × ${formatCurrency(
                            studio.hourlyRate
                          )}`
                        : "Select a time range"}
                    </span>
                    <span className="font-semibold">
                      {duration > 0
                        ? formatCurrency(estimatedTotal)
                        : formatCurrency(0)}
                    </span>
                  </div>
                  {Number(studio.securityDeposit) > 0 ? (
                    <div className="mt-2 flex justify-between gap-3 text-xs text-muted-foreground">
                      <span>Security deposit (refundable)</span>
                      <span>{formatCurrency(studio.securityDeposit)}</span>
                    </div>
                  ) : null}
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    The server calculates the final total when you send the
                    request. You won&apos;t be charged here.
                  </p>
                </div>

                {formError ? (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {formError}
                  </p>
                ) : null}

                {isOwner ? (
                  <div className="rounded-lg border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    This is your studio. You can manage it from your dashboard.
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="h-11 w-full"
                  disabled={submitting || isOwner}
                >
                  {submitting ? (
                    <LoaderCircle
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <CalendarDays className="size-4" aria-hidden="true" />
                  )}
                  {submitting ? "Sending request..." : "Request booking"}
                </Button>

                {!session?.user ? (
                  <p className="text-center text-xs text-muted-foreground">
                    You&apos;ll be asked to log in before sending the request.
                  </p>
                ) : null}
              </form>
            )}

            <div className="mt-5 flex items-start gap-2 border-t pt-4 text-xs leading-5 text-muted-foreground">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                aria-hidden="true"
              />
              The host reviews every request before it is confirmed. If the
              slot is already taken, you&apos;ll be asked to choose another
              time.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
