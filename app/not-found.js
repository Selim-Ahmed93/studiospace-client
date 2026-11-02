import Link from "next/link";
import { Aperture, ArrowLeft, Compass } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Aperture className="size-8" aria-hidden="true" />
      </span>

      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        404 — Page not found
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        This space is out of frame.
      </h1>

      <p className="mt-4 max-w-md text-muted-foreground">
        The page you&apos;re looking for may have moved, been removed, or never
        existed. Let&apos;s get you back to the studios.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className={cn(buttonVariants(), "h-11 px-5")}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back home
        </Link>
        <Link
          href="/studios"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          <Compass className="size-4" aria-hidden="true" />
          Explore studios
        </Link>
      </div>
    </main>
  );
}
