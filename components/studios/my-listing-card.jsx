"use client";

import Link from "next/link";
import { Eye, MapPin, Pencil, Star, Trash2, Users } from "lucide-react";

import SafeImage from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function MyListingCard({ studio, onDelete }) {
  const rating = Number(studio?.rating || 0);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <SafeImage
          src={studio?.images?.[0]}
          alt={studio?.title}
          className="h-full w-full object-cover"
        />

        <Badge
          variant="secondary"
          className="absolute left-4 top-4 bg-background/90 text-foreground shadow-sm backdrop-blur"
        >
          {studio?.category}
        </Badge>

        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          <Star
            className="size-3.5 fill-amber-400 text-amber-500"
            aria-hidden="true"
          />
          {rating > 0 ? rating.toFixed(1) : "New"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
          {studio?.title}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">
            {[studio?.location?.city, studio?.location?.country]
              .filter(Boolean)
              .join(", ") || "Location unavailable"}
          </span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-muted/50 p-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Hourly rate</p>
            <p className="mt-0.5 font-semibold">
              {formatCurrency(studio?.hourlyRate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Capacity</p>
            <p className="mt-0.5 flex items-center gap-1 font-semibold">
              <Users className="size-3.5" aria-hidden="true" />
              {studio?.maxCapacity}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={`/studios/${studio?._id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 flex-1 px-3"
            )}
          >
            <Eye className="size-4" aria-hidden="true" />
            View
          </Link>

          <Link
            href={`/studios/edit/${studio?._id}`}
            className={cn(buttonVariants({ size: "sm" }), "h-9 flex-1 px-3")}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Edit
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(studio)}
            aria-label={`Delete ${studio?.title}`}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}
