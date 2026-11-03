import Link from "next/link";
import {
  Aperture,
  BadgeCheck,
  Crown,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  GitHubLogo,
  InstagramLogo,
  LinkedInLogo,
  XLogo,
} from "@/components/icons/social-icons";
import NewsletterForm from "@/components/layout/newsletter-form";
import { STUDIO_CATEGORIES } from "@/lib/constants";

const trustItems = [
  {
    title: "Host Guarantee",
    description: "Comprehensive liability & asset protection",
    icon: ShieldCheck,
  },
  {
    title: "Verified Workspaces",
    description: "Inspected workspaces, vetted hosts, & gear",
    icon: BadgeCheck,
  },
  {
    title: "Creator First",
    description: "Zero booking fees, instant, transparent booking",
    icon: Crown,
  },
];

const quickLinks = [
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Add Your Studio", href: "/add-studio" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Dashboard", href: "/dashboard" },
];

const socialLinks = [
  { label: "X", href: "https://x.com", Icon: XLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInLogo },
  { label: "GitHub", href: "https://github.com", Icon: GitHubLogo },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#26272B] text-white/60">
      <div className="border-b border-white/10 bg-[#2F3035]">
        <div className="mx-auto grid max-w-5xl gap-7 px-4 py-10 sm:px-6 md:grid-cols-3 md:gap-10">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-400">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[13px] font-semibold text-white">{title}</p>
                <p className="mt-1 text-[11px] leading-5 text-white/50">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_0.9fr_0.8fr_1.3fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5"
            aria-label="StudioSpace home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <Aperture className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[17px] font-extrabold tracking-tight text-white">
                Studio<span className="text-brand">Space</span>
              </span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Creative Marketplace
              </span>
            </span>
          </Link>

          <p className="mt-4 max-w-xs text-sm leading-6 text-white/50">
            A peer-to-peer marketplace for creative spaces. Discover
            photography lofts, sound stages, podcast rooms, and workshops —
            then book them by the hour.
          </p>

          <div className="mt-6 flex items-center gap-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`StudioSpace on ${label}`}
                className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-brand/40 hover:text-brand"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-white">
            Popular Categories
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-white/50">
            {STUDIO_CATEGORIES.map((category) => (
              <li key={category.value}>
                <Link
                  href={`/studios?category=${encodeURIComponent(
                    category.value
                  )}`}
                  className="transition-colors hover:text-brand"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-semibold text-white">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/50">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-[13px] font-semibold text-white">
            Stay in the loop
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            New spaces, host stories, and booking tips — straight to your
            inbox.
          </p>

          <NewsletterForm inverted />

          <a
            href="mailto:mdselimahmed6467@gmail.com"
            className="mt-5 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-brand"
          >
            <Mail className="size-4" aria-hidden="true" />
            mdselimahmed6467@gmail.com
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-[11px] text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <a
              href="mailto:mdselimahmed6467@gmail.com"
              className="transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
