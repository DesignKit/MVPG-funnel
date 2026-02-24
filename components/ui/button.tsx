import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-transform active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-black text-white rounded-pill shadow-button hover:opacity-90",
        orange:
          "bg-primary text-white rounded-pill hover:bg-primary-hover",
        outline:
          "border border-primary bg-white text-foreground rounded-pill hover:bg-surface-warm",
        ghost: "text-foreground hover:opacity-70",
      },
      size: {
        default: "px-8 py-3 text-base",
        sm: "px-5 py-2 text-sm",
        lg: "px-10 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <a
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
}

export { buttonVariants };
