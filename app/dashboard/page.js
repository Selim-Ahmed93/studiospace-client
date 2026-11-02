import ProtectedRoute from "@/components/auth/protected-route";
import Dashboard from "@/components/dashboard/dashboard";

export const metadata = {
  title: "Dashboard",
  description:
    "Manage your StudioSpace listings, booking requests, and upcoming sessions.",
};

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </main>
  );
}
