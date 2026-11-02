import ProtectedRoute from "@/components/auth/protected-route";
import MyListings from "@/components/studios/my-listings";

export const metadata = {
  title: "My listings",
  description: "Manage the creative studio listings you host on StudioSpace.",
};

export default function MyListingsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ProtectedRoute>
        <MyListings />
      </ProtectedRoute>
    </main>
  );
}
