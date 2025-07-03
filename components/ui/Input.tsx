import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../src/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  animated?: boolean;
}

export function Input({ className, animated = true, ...props }: InputProps) {
  const InputComponent = animated ? motion.input : 'input';
  const motionProps = animated ? {
    whileFocus: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <InputComponent
      className={cn(
        "flex h-10 w-full rounded-lg border-2 border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/30",
        className
      )}
      {...motionProps}
      {...props}
    />
  );
}