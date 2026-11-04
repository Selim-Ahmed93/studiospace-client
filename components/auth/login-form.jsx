"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import AuthShell from "@/components/auth/auth-shell";
import { GoogleIcon } from "@/components/icons/google-icon";
import PageSpinner from "@/components/shared/page-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthCapabilities } from "@/hooks/use-auth-capabilities";
import { getAuthErrorMessage, getPostAuthPath } from "@/lib/auth-error";
import { signIn, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { googleAuthEnabled } = useAuthCapabilities();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        const message = getAuthErrorMessage(
          error,
          "Invalid email or password."
        );
        setError("root", { message });
        toast.error(message);
        return;
      }

      toast.success("Welcome back!");

      const destination = getPostAuthPath(window.location.search);
      router.push(destination);
      router.refresh();
    } catch {
      const message =
        "Cannot reach the StudioSpace API. Check your connection and try again.";
      setError("root", { message });
      toast.error(message);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const callbackURL = `${window.location.origin}${getPostAuthPath(
        window.location.search
      )}`;
      const { data, error } = await signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        toast.error(
          getAuthErrorMessage(error, "Google login is not available right now.")
        );
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error(
        "Could not reach Google sign-in. Check your connection and try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!isPending && session) {
      router.replace(getPostAuthPath(window.location.search));
    }
  }, [isPending, session, router]);

  if (!isPending && session) {
    return <PageSpinner label="Taking you to your dashboard..." />;
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage your studio listings and booking requests."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {errors.root?.message ? (
          <p
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {errors.root.message}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn("h-11", errors.email && "border-destructive")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email?.message ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={cn(
                "h-11 pr-10",
                errors.password && "border-destructive"
              )}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errors.password?.message ? (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-11 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="size-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>

      {/* Only render Google when the API confirms that OAuth is configured. */}
      {googleAuthEnabled ? (
        <>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <LoaderCircle
                className="size-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <GoogleIcon className="size-4" />
            )}
            Continue with Google
          </Button>
        </>
      ) : null}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
