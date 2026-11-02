import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import ProtectedRoute from "@/components/auth/protected-route";
import EditStudio from "@/components/studios/edit-studio";

export const metadata = {
  title: "Edit studio",
  description: "Update your StudioSpace listing details and pricing.",
};

export default async function EditStudioPage({ params }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to my listings
      </Link>

      <div className="mb-8 mt-4">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Host dashboard
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Edit your studio
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Keep your listing accurate so creators know exactly what to expect.
        </p>
      </div>

      <ProtectedRoute>
        <EditStudio studioId={id} />
      </ProtectedRoute>
    </main>
  );
}
