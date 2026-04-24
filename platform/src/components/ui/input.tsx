import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border border-win-charcoal/15 bg-white px-3 text-base text-win-charcoal outline-none transition-colors placeholder:text-win-charcoal/40 focus:border-win-gold focus:ring-2 focus:ring-win-gold/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[6rem] w-full rounded-lg border border-win-charcoal/15 bg-white px-3 py-2 text-base text-win-charcoal outline-none transition-colors placeholder:text-win-charcoal/40 focus:border-win-gold focus:ring-2 focus:ring-win-gold/30 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-win-charcoal", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";
