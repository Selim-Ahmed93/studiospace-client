import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

import SafeImage from "@/components/shared/safe-image";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function StudioCard({ studio, className }) {
  const rating = Number(studio?.rating || 0);
  const city = studio?.location?.city;
  const country = studio?.location?.country;

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <SafeImage
          src={studio?.images?.[0]}
          alt={studio?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
          {studio?.title}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">
            {[city, country].filter(Boolean).join(", ") ||
              "Location unavailable"}
          </span>
        </p>

        <div className="mt-5 flex items-end justify-between gap-4 border-t pt-4">
          <p className="text-xl font-bold tracking-tight">
            {formatCurrency(studio?.hourlyRate)}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / hr
            </span>
          </p>

          <Link
            href={`/studios/${studio?._id}`}
            className={cn(buttonVariants({ size: "sm" }), "h-9 px-4")}
          >
            View Details
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
