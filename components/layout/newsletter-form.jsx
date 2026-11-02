"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "studiospace-newsletter";

export default function NewsletterForm() {
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
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 bg-background"
        />
        <Button type="submit" size="icon" className="size-10 shrink-0">
          <ArrowRight className="size-4" aria-hidden="true" />
          <span className="sr-only">Subscribe to the newsletter</span>
        </Button>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Occasional updates about new studios and openings. No spam.
      </p>
    </form>
  );
}
