'use client';
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium mb-6">
            Your Creative Space Starts Here
          </span>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
            Find the Perfect Space for Your
            <span className="text-primary"> Creative Vision</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-6">
            Discover and book photography studios, music rooms,
            podcast spaces, and creative workspaces.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
            <Link
              href="/studios"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Explore Studios
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Browse Categories
              <Search size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

