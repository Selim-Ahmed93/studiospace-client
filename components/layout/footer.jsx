"use client";
import Link from "next/link";
import { Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold">
              Studio<span className="text-primary">Space</span>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground leading-6 max-w-xs">
              Discover creative spaces, connect with studio owners,
              and book the perfect place for your next project.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <Link href="/studios" className="hover:text-primary">Explore Studios</Link>
              <Link href="/categories" className="hover:text-primary">Categories</Link>
              <Link href="/register" className="hover:text-primary">Become a Member</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>

            <a
              href="mailto:mdselimahmed6467@gmail.com"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail size={18} />
              mdselimahmed6467@gmail.com
              <ArrowUpRight size={15} />
            </a>

            <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
              <MapPin size={18} />
              Bangladesh
            </div>
          </div>

        </div>

        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <p>Made for creative people.</p>
        </div>
      </div>
    </footer>
  );
}

