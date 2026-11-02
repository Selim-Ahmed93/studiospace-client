"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import SafeImage from "@/components/shared/safe-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HERO_SLIDES, STUDIO_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Hero() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (city.trim()) params.set("city", city.trim());
    if (category !== "all") params.set("category", category);

    const query = params.toString();
    router.push(query ? `/studios?${query}` : "/studios");
  };

  return (
    <section className="relative isolate">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        navigation
        loop
        className="ss-swiper h-[620px] w-full sm:h-[680px]"
      >
        {HERO_SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="relative h-full w-full">
              <SafeImage
                src={slide.image}
                alt={slide.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

              <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 pb-32 pt-10 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-white">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    {slide.eyebrow}
                  </span>

                  {index === 0 ? (
                    <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </h1>
                  ) : (
                    <p className="mt-6 text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                      {slide.title}
                    </p>
                  )}

                  <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-white/80 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/studios"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-11 bg-white px-5 text-slate-950 hover:bg-white/90"
                      )}
                    >
                      Explore studios
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                    <Link
                      href="/add-studio"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "h-11 border-white/30 bg-white/10 px-5 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                      )}
                    >
                      List your space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="rounded-2xl border bg-card/95 p-3 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-4"
          aria-label="Search studios"
        >
          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by studio or keyword"
                className="h-12 bg-background pl-10"
                aria-label="Search by studio or keyword"
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 w-full bg-background">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {STUDIO_CATEGORIES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <MapPin
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City"
                className="h-12 bg-background pl-10"
                aria-label="City"
              />
            </div>

            <Button type="submit" className="h-12 px-6">
              Search
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Popular:</span>
          {STUDIO_CATEGORIES.slice(0, 4).map((item) => (
            <Link
              key={item.value}
              href={`/studios?category=${encodeURIComponent(item.value)}`}
              className="transition-colors hover:text-primary"
            >
              {item.value}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
