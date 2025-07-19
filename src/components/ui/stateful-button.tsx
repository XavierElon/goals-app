"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { BackgroundGradient } from "./background-gradient";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-transparent text-white shadow-xs",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface StatefulButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isSubmitting?: boolean
  children: React.ReactNode
}

const Button = ({ className, variant, size, children, isSubmitting, onClick, ...props }: StatefulButtonProps) => {
  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      await onClick(event)
    }
  }

  // If variant is gradient, wrap with BackgroundGradient
  if (variant === "gradient") {
    return (
      <BackgroundGradient>
        <button
          className={cn(
            buttonVariants({ variant, size, className }),
          )}
          {...props}
          onClick={handleClick}
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            {isSubmitting && <Loader />}
            {children}
          </div>
        </button>
      </BackgroundGradient>
    )
  }

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, className }),
      )}
      {...props}
      onClick={handleClick}
      disabled={isSubmitting}
    >
      <div className="flex items-center gap-2">
        {isSubmitting && <Loader />}
        {children}
      </div>
    </button>
  );
};

const Loader = () => {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
};



export { Button, buttonVariants }; 