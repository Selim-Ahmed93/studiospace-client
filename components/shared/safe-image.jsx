"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Arbitrary studio image URLs come from user listings, so next/image cannot
// whitelist them ahead of time.
/* eslint-disable @next/next/no-img-element */
export default function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null);
  const failed = Boolean(src) && failedSrc === src;

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-muted text-muted-foreground",
          fallbackClassName
        )}
        role="img"
        aria-label={`${alt || "Studio"} image unavailable`}
      >
        <ImageOff className="size-8 opacity-60" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "StudioSpace studio"}
      className={className}
      onError={() => setFailedSrc(src)}
      {...props}
    />
  );
}
/* eslint-enable @next/next/no-img-element */
