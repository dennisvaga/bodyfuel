"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@repo/ui/lib/cn";

interface AnimatedTextProps {
  children: React.ReactNode;
  delay?: number; // delay in ms before animation starts
  className?: string;
}

const AnimatedText = ({
  children,
  delay = 0,
  className = "",
}: AnimatedTextProps) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "transition-all duration-800 ease-out", // smooth animation with 800ms duration
        isAnimated
          ? "opacity-100 translate-y-0" // final state: visible and in position
          : "opacity-0 translate-y-8", // initial state: invisible and slightly down
        className
      )}
    >
      {children}
    </div>
  );
};

// Group component for staggered animations
interface AnimatedTextGroupProps {
  children: React.ReactNode[];
  staggerDelay?: number; // delay between each text in ms
  initialDelay?: number; // delay before first text starts
}

export const AnimatedTextGroup = ({
  children,
  staggerDelay = 200, // 200ms between each text
  initialDelay = 0,
}: AnimatedTextGroupProps) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <AnimatedText
          key={index}
          delay={initialDelay + index * staggerDelay} // progressive delay
        >
          {child}
        </AnimatedText>
      ))}
    </>
  );
};

export default AnimatedText;
