import { CalendarCheck, Search, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Browse by category, city, and hourly rate. Open a listing to see the space, amenities, and exact pricing.",
  },
  {
    icon: CalendarCheck,
    title: "Book",
    description:
      "Choose your date and time. StudioSpace calculates the total before you send the request, so there are no surprises.",
  },
  {
    icon: Sparkles,
    title: "Create",
    description:
      "The host confirms your request, you show up, and the space is ready for the shoot, recording, or workshop.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          How it works
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          From idea to booked in three steps
        </h2>
        <p className="mt-3 text-muted-foreground">
          No long leases, no hidden fees. Just the space you need, for the time
          you need it.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm"
            >
              <span className="absolute right-6 top-5 text-5xl font-bold tracking-tighter text-muted/70">
                0{index + 1}
              </span>

              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <h3 className="mt-5 text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
