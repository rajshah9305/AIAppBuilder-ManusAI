import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../src/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  animated?: boolean;
}

export function Textarea({ className, animated = true, ...props }: TextareaProps) {
  const TextareaComponent = animated ? motion.textarea : 'textarea';
  const motionProps = animated ? {
    whileFocus: { scale: 1.01 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <TextareaComponent
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border-2 border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-primary/30 resize-none",
        className
      )}
      {...motionProps}
      {...props}
    />
  );
}