import ProtectedRoute from "@/components/auth/protected-route";
import StudioForm from "@/components/studios/studio-form";

export const metadata = {
  title: "Add a studio",
  description:
    "List your photography studio, sound stage, podcast room, music suite, or art workshop on StudioSpace.",
};

export default function AddStudioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          For hosts
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          List your studio
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Add the details creators need to book with confidence: photos,
          amenities, location, and your hourly rate.
        </p>
      </div>

      <ProtectedRoute>
        <StudioForm mode="create" />
      </ProtectedRoute>
    </main>
  );
}
