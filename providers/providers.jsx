"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function Providers({ children }) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </>
  );
}
