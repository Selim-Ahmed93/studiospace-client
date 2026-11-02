import {
  BadgeDollarSign,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Book by the hour",
    description:
      "Pay for the time you actually need. No long-term leases or unused days.",
  },
  {
    icon: BadgeDollarSign,
    title: "Clear, upfront pricing",
    description:
      "See the hourly rate and the calculated total before you send a booking request.",
  },
  {
    icon: ShieldCheck,
    title: "Host-controlled bookings",
    description:
      "Every request is reviewed by the studio host, so the space stays in the right hands.",
  },
  {
    icon: MapPin,
    title: "Local creative spaces",
    description:
      "Discover photography lofts, sound stages, podcast rooms, and workshops across Dhaka.",
  },
];

export default function WhyStudioSpace() {
  return (
    <section className="border-y bg-muted/25">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why StudioSpace
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the way creative work actually happens
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              A studio marketplace should make the logistics disappear. That
              means honest pricing, real availability, and a host who knows
              their space.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border bg-card p-5 shadow-sm"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
