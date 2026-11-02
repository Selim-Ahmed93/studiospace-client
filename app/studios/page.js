import { Suspense } from "react";

import PageSpinner from "@/components/shared/page-spinner";
import ExploreStudios from "@/components/studios/explore-studios";

export const metadata = {
  title: "Explore studios",
  description:
    "Browse photography studios, sound stages, podcast rooms, music suites, and art workshops available by the hour.",
};

export default function StudiosPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="max-w-3xl">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Explore studios
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Find a space that fits the work
        </h1>
        <p className="mt-3 text-muted-foreground">
          Filter by category, city, and hourly rate. Every listing shows the
          space, amenities, and price before you book.
        </p>
      </div>

      <div className="mt-8">
        <Suspense fallback={<PageSpinner label="Loading studios..." />}>
          <ExploreStudios />
        </Suspense>
      </div>
    </main>
  );
}
