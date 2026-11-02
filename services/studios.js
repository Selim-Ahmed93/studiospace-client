import api from "@/lib/axios";

export async function fetchStudios(params = {}) {
  const { data } = await api.get("/api/studios", { params });

  return {
    studios: data?.studios ?? [],
    pagination: data?.pagination ?? null,
  };
}

export async function fetchAllStudios() {
  const studios = [];
  let page = 1;
  let totalPages = 1;

  do {
    const { data } = await api.get("/api/studios", {
      params: { page, limit: 50 },
    });

    studios.push(...(data?.studios ?? []));
    totalPages = data?.pagination?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages && page <= 10);

  return studios;
}

export async function fetchStudio(id) {
  const { data } = await api.get(`/api/studios/${id}`);

  return data?.data ?? null;
}

export async function createStudio(payload) {
  const { data } = await api.post("/api/studios", payload);

  return data?.data ?? null;
}

export async function updateStudio(id, payload) {
  const { data } = await api.patch(`/api/studios/${id}`, payload);

  return data?.data ?? null;
}

export async function deleteStudio(id) {
  const { data } = await api.delete(`/api/studios/${id}`);

  return data?.data ?? null;
}
