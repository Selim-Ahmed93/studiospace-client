import Link from "next/link";
import { ArrowRight, Camera, Film, Mic, Music, Palette } from "lucide-react";

import SafeImage from "@/components/shared/safe-image";
import { STUDIO_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categoryIcons = {
  camera: Camera,
  clapperboard: Film,
  mic: Mic,
  music: Music,
  palette: Palette,
};

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Browse by category
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Find your kind of space
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every project needs a different room. Start with the space that
            fits the way you create.
          </p>
        </div>

        <Link
          href="/studios"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
        >
          View all studios
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {STUDIO_CATEGORIES.map((category, index) => {
          const Icon = categoryIcons[category.icon] || Camera;

          return (
            <Link
              key={category.value}
              href={`/studios?category=${encodeURIComponent(category.value)}`}
              className={cn(
                "group relative isolate flex min-h-[250px] flex-col justify-end overflow-hidden rounded-2xl p-5 text-white ring-1 ring-black/5",
                index < 2 ? "lg:col-span-3" : "lg:col-span-2"
              )}
            >
              <SafeImage
                src={category.image}
                alt={category.label}
                className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />

              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-white/75">
                  {category.value}
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                {category.label}
              </h3>
              <p className="mt-1 max-w-sm text-sm leading-6 text-white/75">
                {category.description}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                Browse spaces
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
