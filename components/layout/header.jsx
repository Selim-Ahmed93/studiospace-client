"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Aperture,
  Building2,
  CalendarDays,
  Compass,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PlusCircle,
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
];

const privateLinks = [
  { name: "Add Studio", href: "/add-studio", icon: PlusCircle },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Listings", href: "/my-listings", icon: Building2 },
  { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
];

function isLinkActive(pathname, href) {
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
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      isLinkActive(pathname, href)
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    );

  const mobileLinkClass = (href) =>
    cn(
      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
      isLinkActive(pathname, href)
        ? "bg-primary/10 text-primary"
        : "text-foreground hover:bg-muted"
    );

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Aperture className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass(link.href)}
            >
              {link.name}
            </Link>
          ))}

          {user
            ? privateLinks.slice(0, 1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={navLinkClass(link.href)}
                >
                  {link.name}
                </Link>
              ))
            : null}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
          >
            <Sun className="hidden dark:block" aria-hidden="true" />
            <Moon className="block dark:hidden" aria-hidden="true" />
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            {isPending ? (
              <Skeleton className="size-9 rounded-full" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.image || undefined} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64">
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
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 px-4"
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }), "h-9 px-4")}
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(22rem,88vw)]">
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Aperture className="size-4" aria-hidden="true" />
                  </span>
                  StudioSpace
                </SheetTitle>
                <SheetDescription>
                  Browse, book, and manage creative spaces.
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
                        "w-full"
                      )}
                    >
                      <LogIn className="size-4" aria-hidden="true" />
                      Log in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants(), "w-full")}
                    >
                      <UserPlus className="size-4" aria-hidden="true" />
                      Create account
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
