import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../src/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'gradient' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  loading?: boolean;
  pulse?: boolean;
}

export function Button({
  children,
  variant = 'default',
  size = 'md',
  animated = true,
  loading = false,
  pulse = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
    outline: "border-2 border-input hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:shadow-sm",
    gradient: "btn-gradient shadow-md hover:shadow-lg hover:-translate-y-1",
    glow: "bg-primary/20 text-primary border-2 border-primary/50 hover:bg-primary hover:text-primary-foreground hover:shadow-glow transition-all duration-300"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
    xl: "h-14 px-10 text-xl"
  };

  const ButtonComponent = animated ? motion.button : 'button';
  const motionProps = animated ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  const isDisabled = disabled || loading;

  return (
    <ButtonComponent
      className={cn(
        baseClasses, 
        variants[variant], 
        sizes[size], 
        pulse && "animate-pulse-glow",
        loading && "btn-loading",
        className
      )}
      disabled={isDisabled}
      {...motionProps}
      {...props}
    >
      {/* Shimmer effect for primary and gradient buttons */}
      {(variant === 'default' || variant === 'gradient') && (
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full hover:translate-x-full" />
      )}
      
      {/* Glow effect for glow variant */}
      {variant === 'glow' && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
      )}
      
      <span className="relative z-10 flex items-center justify-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            {children}
          </>
        ) : (
          children
        )}
      </span>
    </ButtonComponent>
  );
}