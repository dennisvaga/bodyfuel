"use client";

import React, { useEffect, useState } from "react";
import { Bot } from "lucide-react";

interface AnimatedRobotIconProps {
  className?: string;
  size?: number;
  enableGreeting?: boolean;
  showCircle?: boolean; // Control whether to show circle animation
}

// Module-level variable to track if greeting has been shown in this session
let hasShownGreetingInSession = false;

/**
 * Animated robot icon component with robotic greeting animation
 * Features wave-like movement, gentle rotation, and pulsing effects
 */
export function AnimatedRobotIcon({
  className = "",
  size = 24,
  enableGreeting = true,
  showCircle = true,
}: AnimatedRobotIconProps) {
  const [isGreeting, setIsGreeting] = useState(false);

  // Handle initial mount greeting (only once per session)
  useEffect(() => {
    if (!enableGreeting || hasShownGreetingInSession) return;

    const greetingTimer = setTimeout(() => {
      setIsGreeting(true);
      hasShownGreetingInSession = true;
    }, 1000);

    const resetTimer = setTimeout(() => {
      setIsGreeting(false);
    }, 6000);

    return () => {
      clearTimeout(greetingTimer);
      clearTimeout(resetTimer);
    };
  }, [enableGreeting]);

  return (
    <div className="relative inline-block">
      <Bot
        className={`
          ${className}
          transition-all duration-500 ease-in-out hover:scale-110
        `}
        style={{
          width: size,
          height: size,
          animation: isGreeting ? "robotGreeting 1.5s ease-in-out 2" : "none",
        }}
      />

      {/* Greeting wave effect - finite animation */}
      {isGreeting && showCircle && (
        <div
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-75"
          style={{
            animation: "slowPing 1.5s cubic-bezier(0, 0, 0.2, 1) 2",
          }}
        />
      )}

      {/* Subtle glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full opacity-20 blur-sm
          ${isGreeting ? "bg-yellow-200" : ""}
        `}
        style={{
          animation: isGreeting ? "slowPulse 1.5s ease-in-out 2" : "none",
        }}
      />

      <style jsx>{`
        @keyframes slowPing {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          75% {
            transform: scale(2);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @keyframes slowPulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes robotWave {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          25% {
            transform: rotate(-15deg) scale(1.1);
          }
          50% {
            transform: rotate(15deg) scale(1.05);
          }
          75% {
            transform: rotate(-10deg) scale(1.1);
          }
        }

        @keyframes robotGreeting {
          0% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-4px) rotate(8deg) scale(1.05);
          }
          50% {
            transform: translateY(0px) rotate(-8deg) scale(1);
          }
          75% {
            transform: translateY(-2px) rotate(4deg) scale(1.02);
          }
          100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
