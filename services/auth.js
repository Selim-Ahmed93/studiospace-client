import api from "@/lib/axios";

/**
 * Read public auth capabilities from the API. The endpoint only returns
 * feature flags, so no OAuth secret or credential is ever sent to the browser.
 */
export async function fetchAuthConfig() {
  const { data } = await api.get("/api/config", { timeout: 15000 });

  return {
    googleAuthEnabled: Boolean(data?.data?.googleAuthEnabled),
  };
}
