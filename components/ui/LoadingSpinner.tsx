import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../src/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'bars' | 'pulse' | 'orbit';
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  variant = 'default',
  className,
  text
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        );
      
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[2, 3, 4, 3, 2].map((height, i) => (
              <motion.div
                key={i}
                className={`w-1 bg-primary rounded-full`}
                style={{ height: `${height * 4}px` }}
                animate={{ scaleY: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <motion.div
            className={cn("bg-primary rounded-full", sizes[size])}
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        );
      
      case 'orbit':
        return (
          <div className={cn("relative", sizes[size])}>
            <motion.div
              className="absolute inset-0 border-2 border-primary/20 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `50% ${sizes[size] === 'w-4 h-4' ? '10px' : sizes[size] === 'w-8 h-8' ? '18px' : sizes[size] === 'w-12 h-12' ? '26px' : '34px'}` }}
            />
          </div>
        );
      
      default:
        return (
          <motion.div
            className={cn(
              "border-2 border-primary/20 border-t-primary rounded-full",
              sizes[size]
            )}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center">
        {renderSpinner()}
      </div>
      {text && (
        <motion.p
          className="mt-4 text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
