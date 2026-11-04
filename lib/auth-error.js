/**
 * Turn a Better Auth client error into a human-readable message. Better Auth
 * returns structured objects like `{ status, code, message }`; network failures
 * are thrown and should be handled by the caller.
 */
export function getAuthErrorMessage(error, fallback) {
  if (!error) return fallback;

  switch (error.code) {
    case "PROVIDER_NOT_FOUND":
      return "Google sign-in is not enabled on the server yet.";
    case "INVALID_ORIGIN":
    case "INVALID_CALLBACK_URL":
      return "This site is not trusted by the API. Check the server CLIENT_URL setting.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return error.message || fallback;
  }
}

/**
 * Only allow same-origin path redirects, and fall back to the home page when no
 * safe `redirect` query parameter is present.
 */
export function getPostAuthPath(search, fallback = "/") {
  const redirect = new URLSearchParams(search).get("redirect");

  if (!redirect?.startsWith("/") || redirect.startsWith("//")) {
    return fallback;
  }

  // Never bounce a freshly authenticated user back into an auth screen.
  if (
    redirect === "/login" ||
    redirect.startsWith("/login?") ||
    redirect === "/register" ||
    redirect.startsWith("/register?")
  ) {
    return fallback;
  }

  return redirect;
}
