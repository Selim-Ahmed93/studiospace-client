import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-background text-primary ring-1 ring-foreground/10">
        <Icon className="size-6" aria-hidden="true" />
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight">{title}</h3>

      {description ? (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
