import ProtectedRoute from "@/components/auth/protected-route";
import MyBookings from "@/components/bookings/my-bookings";

export const metadata = {
  title: "My bookings",
  description:
    "Track your StudioSpace booking requests, confirmed sessions, and history.",
};

export default function MyBookingsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    </main>
  );
}
