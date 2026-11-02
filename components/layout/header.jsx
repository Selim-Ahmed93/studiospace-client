"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Studio<span className="text-primary">Space</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/">Home</Link>
          <Link href="/studios">Explore Studios</Link>
          <Link href="/categories">Categories</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-2 rounded-md border"
            aria-label="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link href="/login" className="hidden sm:block">
            Login
          </Link>

          <Link
            href="/register"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Register
          </Link>
        </div>
      </nav>
    </header>
  );
}
