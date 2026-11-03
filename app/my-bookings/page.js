import ProtectedRoute from "@/components/auth/protected-route";
import MyBookings from "@/components/bookings/my-bookings";

export const metadata = {
  title: "My bookings",
  description:
    "Track your StudioSpace booking requests, confirmed sessions, and history.",
};

export default function MyBookingsPage() {
  return (
    <main>
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    </main>
  );
}
