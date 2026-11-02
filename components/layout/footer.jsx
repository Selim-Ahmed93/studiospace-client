import Link from "next/link";
import { Aperture, Mail, MapPin } from "lucide-react";

import {
  GitHubLogo,
  InstagramLogo,
  LinkedInLogo,
  XLogo,
} from "@/components/icons/social-icons";
import NewsletterForm from "@/components/layout/newsletter-form";
import { STUDIO_CATEGORIES } from "@/lib/constants";

const platformLinks = [
  { label: "Explore Studios", href: "/studios" },
  { label: "Add Your Studio", href: "/add-studio" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Bookings", href: "/my-bookings" },
];

const socialLinks = [
  { label: "X", href: "https://x.com", Icon: XLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInLogo },
  { label: "GitHub", href: "https://github.com", Icon: GitHubLogo },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5"
              aria-label="StudioSpace home"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Aperture className="size-5" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight">
                Studio<span className="text-primary">Space</span>
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
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
                  className="flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Browse categories</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(
                      category.value
                    )}`}
                    className="transition-colors hover:text-primary"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Platform</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Stay in the loop</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              New spaces, host stories, and booking tips — straight to your
              inbox.
            </p>

            <NewsletterForm />

            <div className="mt-5 space-y-2 text-sm text-muted-foreground">
              <a
                href="mailto:mdselimahmed6467@gmail.com"
                className="flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="size-4" aria-hidden="true" />
                mdselimahmed6467@gmail.com
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="size-4" aria-hidden="true" />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <a
              href="mailto:mdselimahmed6467@gmail.com"
              className="hover:text-primary"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
