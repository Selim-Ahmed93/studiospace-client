import Link from "next/link";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

export const metadata = {
  title: "About us",
  description:
    "StudioSpace connects creators with verified photography studios, sound stages, podcast rooms, and workshops.",
};

const values = [
  {
    title: "For hosts",
    description:
      "List a space, set an hourly rate, and manage booking requests from one dashboard.",
    icon: HeartHandshake,
  },
  {
    title: "For creators",
    description:
      "Find the right room for a shoot, recording, or workshop without long leases.",
    icon: Sparkles,
  },
  {
    title: "Built on trust",
    description:
      "Verified workspaces, clear pricing, and a host guarantee on every confirmed booking.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
      <span className="inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-soft-foreground ring-1 ring-brand/20">
        About StudioSpace
      </span>

      <h1 className="mt-3 text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.35rem]">
        Creative space, without the friction
      </h1>

      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        StudioSpace is a peer-to-peer marketplace for creative spaces. We
        connect photographers, filmmakers, podcasters, and artists with
        verified studios, sound stages, and workshops that can be booked by the
        hour.
      </p>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        No long-term leases and no hidden fees. Hosts keep control of their
        space and schedule, and creators get a clear, transparent way to book
        the room their next project needs.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {values.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border border-border/80 bg-card p-5"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-soft-foreground">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-sm font-semibold">{title}</h2>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/studios"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-[13px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
        >
          Explore studios
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <Link
          href="/add-studio"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-card px-4 text-[13px] font-semibold transition-colors hover:bg-muted"
        >
          List your space
        </Link>
      </div>
    </main>
  );
}
