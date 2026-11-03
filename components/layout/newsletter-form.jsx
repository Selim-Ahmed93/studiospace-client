"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "studiospace-newsletter";

export default function NewsletterForm({ inverted = false }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const list = Array.isArray(stored) ? stored : [];

      if (!list.includes(trimmedEmail)) {
        list.push(trimmedEmail);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      }

      setEmail("");
      toast.success("You're on the list. We'll share new studios and updates.");
    } catch {
      toast.error("Could not save your email in this browser.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <label
        htmlFor={inverted ? "newsletter-email-footer" : "newsletter-email"}
        className="sr-only"
      >
        Email address
      </label>
      <div className="flex gap-2">
        <Input
          id={inverted ? "newsletter-email-footer" : "newsletter-email"}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={cn(
            "h-10",
            inverted
              ? "border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-brand/60"
              : "bg-background"
          )}
        />
        <button
          type="submit"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">Subscribe to the newsletter</span>
        </button>
      </div>
      <p
        className={cn(
          "text-xs leading-5",
          inverted ? "text-white/40" : "text-muted-foreground"
        )}
      >
        Occasional updates about new studios and openings. No spam.
      </p>
    </form>
  );
}
