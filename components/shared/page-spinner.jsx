import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PageSpinner({
  label = "Loading StudioSpace...",
  className,
}) {
  return (
    <div
      className={cn(
        "flex min-h-[45vh] flex-col items-center justify-center gap-4 px-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Aperture className="size-8 animate-spin" aria-hidden="true" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
