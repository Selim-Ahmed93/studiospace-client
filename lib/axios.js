import axios from "axios";

const configuredBaseURL = process.env.NEXT_PUBLIC_API_URL?.trim();

const api = axios.create({
  // Empty means "same origin": the browser calls /api/* on the frontend host
  // and Next.js proxies it to the API, keeping auth cookies first-party.
  baseURL: configuredBaseURL || undefined,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
