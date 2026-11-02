"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("StudioSpace route error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <AlertTriangle className="size-8" aria-hidden="true" />
      </span>

      <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        The page hit an unexpected error. Try again, or head back home and
        continue browsing.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="h-11 px-5" onClick={reset}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "h-11 px-5")}
        >
          <Home className="size-4" aria-hidden="true" />
          Back home
        </Link>
      </div>
    </main>
  );
}
