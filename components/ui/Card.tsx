import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../src/utils/cn";

interface CardProps extends React.PropsWithChildren<{ className?: string }> {
  animated?: boolean;
  hover?: boolean;
}

export function Card({ children, className, animated = false, hover = false }: CardProps) {
  const CardComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  const hoverProps = hover ? {
    whileHover: { y: -2, scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cn(
        "rounded-xl border-2 bg-card text-card-foreground shadow-sm transition-all duration-300",
        hover && "hover:shadow-lg hover:border-primary/20",
        className
      )}
      {...motionProps}
      {...hoverProps}
    >
      {children}
    </CardComponent>
  );
}

export function CardHeader({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardContent({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export function CardTitle({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>{children}</p>;
}