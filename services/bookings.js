import api from "@/lib/axios";

export async function createBooking(payload) {
  const { data } = await api.post("/api/bookings", payload);

  return data?.data ?? null;
}

export async function fetchMyBookings() {
  const { data } = await api.get("/api/bookings/my-bookings");

  return data?.data ?? [];
}

export async function cancelBooking(id) {
  const { data } = await api.patch(`/api/bookings/${id}/cancel`);

  return data?.data ?? null;
}
