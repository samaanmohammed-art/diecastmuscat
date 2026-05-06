import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-md border border-input bg-surface px-4 py-3 text-sm text-text",
        "placeholder:text-text-dim",
        "focus-visible:outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "resize-y transition-colors",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
