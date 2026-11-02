import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const hostPoints = [
  "Set your own hourly rate",
  "Approve every booking request",
  "Manage listings in one place",
  "Track upcoming bookings",
];

export default function HostCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-24">
      <div className="relative isolate overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
        <div className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
              For studio hosts
            </span>
            <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Your space could be someone&apos;s next big idea.
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-7 text-white/70">
              List your studio, set your hourly rate, and review booking
              requests from creators who need exactly what you have. It&apos;s
              free to list.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/add-studio"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 bg-white px-5 text-slate-950 hover:bg-white/90"
                )}
              >
                List your studio
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 border-white/30 bg-white/10 px-5 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                )}
              >
                Create an account
              </Link>
            </div>
          </div>

          <ul className="grid gap-3">
            {hostPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
