import { createAuthClient } from "better-auth/react";

const configuredBaseURL = process.env.NEXT_PUBLIC_API_URL?.trim();

export const authClient = createAuthClient({
  // Empty means "same origin": Better Auth calls /api/auth/* through the
  // Next.js proxy, so the OAuth state cookie is stored as a first-party cookie.
  baseURL: configuredBaseURL || undefined,

  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;