export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again."
) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.code === "ECONNABORTED") {
    return "The request took too long. The server may be waking up — please try again.";
  }

  if (error?.message === "Network Error") {
    return "Cannot reach the StudioSpace API. Check your connection and try again.";
  }

  return fallback;
}

export function getApiFieldErrors(error) {
  const errors = error?.response?.data?.errors;

  return Array.isArray(errors) ? errors : [];
}
