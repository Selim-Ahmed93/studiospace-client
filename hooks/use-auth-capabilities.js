"use client";

import { useEffect, useState } from "react";

import { fetchAuthConfig } from "@/services/auth";

/**
 * Fetch server-side auth capabilities once the auth screen mounts. Google is
 * treated as unavailable until the API explicitly reports that it is enabled,
 * so the UI never sends users to a provider the server has not registered.
 */
export function useAuthCapabilities() {
  const [state, setState] = useState({
    isLoading: true,
    googleAuthEnabled: false,
  });

  useEffect(() => {
    let cancelled = false;

    fetchAuthConfig()
      .then((config) => {
        if (cancelled) return;

        setState({
          isLoading: false,
          googleAuthEnabled: Boolean(config.googleAuthEnabled),
        });
      })
      .catch(() => {
        if (cancelled) return;

        setState({ isLoading: false, googleAuthEnabled: false });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
