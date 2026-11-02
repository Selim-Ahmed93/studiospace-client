"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, RefreshCw, WifiOff } from "lucide-react";

import EmptyState from "@/components/shared/empty-state";
import StudioCard from "@/components/studios/studio-card";
import StudioGridSkeleton from "@/components/studios/studio-card-skeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { getApiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { fetchStudios } from "@/services/studios";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchStudios({ limit: 6 });

        if (active) setStudios(result.studios);
      } catch (requestError) {
        if (active) {
          setError(
            getApiErrorMessage(
              requestError,
              "We couldn't load studios right now. Please try again."
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
  }, [requestKey]);

  return (
    <section className="border-y bg-muted/25">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Featured spaces
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Studios ready for your next project
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              A hand-picked look at creative spaces on StudioSpace, from
              daylight lofts to treated recording rooms.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary transition-all hover:gap-2.5"
          >
            View all studios
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <StudioGridSkeleton count={6} />
          ) : error ? (
            <EmptyState
              icon={WifiOff}
              title="Couldn't load studios"
              description={error}
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRequestKey((key) => key + 1)}
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Try again
                </Button>
              }
            />
          ) : studios.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No studios yet"
              description="New spaces are added regularly. Check back soon, or be the first to list your studio."
              action={
                <Link href="/add-studio" className={cn(buttonVariants())}>
                  List your studio
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
