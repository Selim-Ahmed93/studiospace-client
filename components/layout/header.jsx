"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Aperture,
  Building2,
  CalendarDays,
  ChevronDown,
  Compass,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
  Sparkles,
  Sun,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { signOut, useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

const publicLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Explore Studios", href: "/studios", icon: Compass },
  { name: "How It Works", href: "/#how-it-works", icon: Sparkles },
  { name: "About Us", href: "/about", icon: Info },
];

const privateLinks = [
  { name: "Add Studio", href: "/add-studio", icon: PlusCircle },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Listings", href: "/my-listings", icon: Building2 },
  { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

const solidBrandClass =
  "inline-flex h-9 items-center justify-center rounded-full bg-brand px-4 text-[13px] font-semibold text-brand-foreground transition-colors hover:bg-brand-strong focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40";

const ghostBrandClass =
  "inline-flex h-9 items-center justify-center rounded-full px-4 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground";

function isLinkActive(pathname, href) {
  if (href.includes("#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user;
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Account";

  const handleSignOut = async () => {
    const { error } = await signOut();

    if (error) {
      toast.error(error.message || "Could not sign out. Please try again.");
      return;
    }

    toast.success("Signed out successfully.");
    router.push("/");
    router.refresh();
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const navLinkClass = (href) =>
    cn(
      "relative rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
      isLinkActive(pathname, href)
        ? "text-foreground after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand"
        : "text-muted-foreground hover:text-foreground"
    );

  const mobileLinkClass = (href) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isLinkActive(pathname, href)
        ? "bg-brand-soft text-brand-soft-foreground"
        : "text-foreground hover:bg-muted"
    );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="relative mx-auto flex h-[72px] max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-sm shadow-brand/30">
            <Aperture className="size-5" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[17px] font-extrabold tracking-tight">
              Studio<span className="text-brand-strong">Space</span>
            </span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Creative Marketplace
            </span>
          </span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex"
          aria-label="Main"
        >
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="size-9 rounded-full border-border bg-card text-muted-foreground hover:text-foreground"
            aria-label="Toggle color theme"
          >
            <Sun className="hidden size-4 dark:block" aria-hidden="true" />
            <Moon className="size-4 dark:hidden" aria-hidden="true" />
          </Button>

          <div className="hidden items-center gap-1.5 lg:flex">
            {isPending ? (
              <Skeleton className="h-9 w-24 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2.5 outline-none transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-brand/30"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-7">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="bg-brand-soft text-[10px] font-bold text-brand-soft-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-24 truncate text-[13px] font-semibold">
                    {firstName}
                  </span>
                  <ChevronDown
                    className="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-2 py-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  {privateLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <DropdownMenuItem
                        key={link.href}
                        render={<Link href={link.href} />}
                      >
                        <Icon aria-hidden="true" />
                        {link.name}
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut aria-hidden="true" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login" className={ghostBrandClass}>
                  Login
                </Link>
                <Link href="/register" className={solidBrandClass}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(22rem,88vw)]">
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                    <Aperture className="size-4" aria-hidden="true" />
                  </span>
                  StudioSpace
                </SheetTitle>
                <SheetDescription>
                  Creative marketplace for studios and stages.
                </SheetDescription>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile">
                {publicLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={mobileLinkClass(link.href)}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {link.name}
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <div className="my-3 h-px bg-border" />

                    {privateLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={mobileLinkClass(link.href)}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {link.name}
                        </Link>
                      );
                    })}
                  </>
                ) : null}
              </nav>

              <SheetFooter className="border-t">
                <div className="mb-2 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user ? user.name : "Welcome to StudioSpace"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user ? user.email : "Find your next creative space."}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={toggleTheme}
                    aria-label="Toggle color theme"
                  >
                    <Sun className="hidden dark:block" aria-hidden="true" />
                    <Moon className="block dark:hidden" aria-hidden="true" />
                  </Button>
                </div>

                {user ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      setMobileOpen(false);
                      await handleSignOut();
                    }}
                  >
                    <LogOut className="size-4" aria-hidden="true" />
                    Sign out
                  </Button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full rounded-full"
                      )}
                    >
                      <LogIn className="size-4" aria-hidden="true" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={cn(solidBrandClass, "w-full")}
                    >
                      <UserPlus className="size-4" aria-hidden="true" />
                      Sign Up
                    </Link>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
