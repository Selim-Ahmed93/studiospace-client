import { cache } from "react";
import { notFound } from "next/navigation";

import StudioDetails from "@/components/studios/studio-details";

const getStudio = cache(async (id) => {
  // Server-side rendering can call the API directly. API_PROXY_TARGET is the
  // server-only Render URL; NEXT_PUBLIC_API_URL remains a fallback for setups
  // that still point the browser at the API directly.
  const configuredBaseUrl =
    process.env.API_PROXY_TARGET?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();
  const baseUrl = configuredBaseUrl?.replace(/\/+$/, "");

  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/api/studios/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const payload = await response.json();

    return payload?.data ?? null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    return {
      title: "Studio not found",
      description: "This studio listing could not be found on StudioSpace.",
    };
  }

  return {
    title: studio.title,
    description:
      studio.overview ||
      `Book ${studio.title} by the hour on StudioSpace.`,
    openGraph: {
      title: studio.title,
      description:
        studio.overview ||
        `Book ${studio.title} by the hour on StudioSpace.`,
      images: studio.images?.[0] ? [studio.images[0]] : [],
    },
  };
}

export default async function StudioPage({ params }) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <StudioDetails studio={studio} />
    </main>
  );
}
