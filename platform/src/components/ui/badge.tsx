import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-[1.3125rem] w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap transition-all duration-[var(--duration-fast)] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a]:hover:bg-primary/85",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a]:hover:bg-secondary/85",
        destructive:
          "border-destructive/15 bg-destructive/10 text-destructive [a]:hover:bg-destructive/15",
        outline:
          "border-border bg-transparent text-foreground [a]:hover:bg-muted [a]:hover:text-foreground",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link:
          "border-transparent bg-transparent text-primary underline-offset-4 hover:underline",
        success:
          "border-transparent bg-success/12 text-success [a]:hover:bg-success/18",
        warning:
          "border-transparent bg-warning/12 text-warning [a]:hover:bg-warning/18",
        info:
          "border-transparent bg-info/12 text-info [a]:hover:bg-info/18",
        gold:
          "border-transparent bg-primary/15 text-primary [a]:hover:bg-primary/22",
        olive:
          "border-transparent bg-secondary/15 text-secondary [a]:hover:bg-secondary/22",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
