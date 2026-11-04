import Link from "next/link";
import { Aperture, ArrowLeft } from "lucide-react";

import SafeImage from "@/components/shared/safe-image";

export default function AuthShell({ title, description, children }) {
  return (
    <div className="grid min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <SafeImage
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80"
          alt="A bright creative studio with room to work"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/15" />

        <div className="relative flex h-full flex-col justify-between p-10 text-white">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2.5"
            aria-label="StudioSpace home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Aperture className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Studio<span className="text-amber-300">Space</span>
            </span>
          </Link>

          <div className="max-w-md">
            <p className="text-3xl font-semibold leading-snug tracking-tight">
              &ldquo;The right room changes the work.&rdquo;
            </p>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Book photography lofts, sound stages, podcast rooms, and art
              workshops by the hour — then get back to making.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
