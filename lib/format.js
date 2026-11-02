export function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatHourlyRate(value) {
  return `${formatCurrency(value)} / hr`;
}

export function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatTime(value) {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return value || "";

  const [hour, minute] = value.split(":").map(Number);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export function formatHours(value) {
  const hours = Number(value || 0);
  return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

export function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "SS"
  );
}

export function getTodayISODate() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
}

export function getDurationHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const minutes =
    endHour * 60 + endMinute - (startHour * 60 + startMinute);

  return minutes > 0 ? minutes / 60 : 0;
}
