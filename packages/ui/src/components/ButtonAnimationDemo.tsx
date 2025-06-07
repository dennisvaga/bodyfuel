"use client";

import React from "react";
import { cn } from "#lib/cn";

/**
 * Demo component showcasing different button animation variants
 * This component demonstrates various modern, minimal animation approaches
 */

// Custom button variants with different animation styles
const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant:
      | "elevation"
      | "scale-glow"
      | "border-pulse"
      | "gradient-shift"
      | "micro-transform"
      | "product-card"
      | "magnetic"
      | "neon-glow"
      | "morphing"
      | "glass-morph"
      | "particle-burst";
    children: React.ReactNode;
  }
>(({ className, variant, children, ...props }, ref) => {
  const variants = {
    // Current elevation approach
    elevation:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Scale + Glow (Recommended)
    "scale-glow":
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu",

    // Border Pulse
    "border-pulse":
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Gradient Shift
    "gradient-shift":
      "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Micro Transform
    "micro-transform":
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transform-gpu origin-center transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Product Card (No animation)
    "product-card":
      "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Magnetic Pull Effect 🧲
    magnetic:
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.05] hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu",

    // Neon Glow Effect ✨
    "neon-glow":
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.6),0_0_40px_rgba(var(--primary-rgb),0.4),0_0_60px_rgba(var(--primary-rgb),0.2)] hover:scale-[1.02] transition-all duration-300 ease-out transform-gpu",

    // Morphing Border Effect 🔄
    morphing:
      "bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden before:absolute before:inset-0 before:border-2 before:border-transparent before:bg-gradient-to-r before:from-primary/20 before:via-primary/40 before:to-primary/20 before:bg-clip-padding before:mask-composite:exclude before:animate-pulse hover:before:animate-none hover:scale-[1.03] transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] transform-gpu",

    // Glass Morphism Effect 🪟
    "glass-morph":
      "bg-primary/80 backdrop-blur-md text-primary-foreground hover:bg-primary/90 hover:backdrop-blur-lg border border-primary/20 hover:border-primary/40 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(var(--primary-rgb),0.2)] transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu",

    // Particle Burst Effect 💥
    "particle-burst":
      "bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] transform-gpu",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-4 py-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

AnimatedButton.displayName = "AnimatedButton";

// Outline variants
const OutlineAnimatedButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant:
      | "elevation"
      | "scale-glow"
      | "border-pulse"
      | "gradient-shift"
      | "micro-transform";
    children: React.ReactNode;
  }
>(({ className, variant, children, ...props }, ref) => {
  const variants = {
    // Current elevation approach
    elevation:
      "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:border-primary/60 dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Scale + Glow (Recommended)
    "scale-glow":
      "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:border-primary/60 dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] transform-gpu",

    // Border Pulse
    "border-pulse":
      "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Gradient Shift
    "gradient-shift":
      "border-2 border-transparent bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-primary/20 hover:to-primary/30 hover:text-primary dark:hover:text-primary backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",

    // Micro Transform
    "micro-transform":
      "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:border-primary/60 dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary hover:scale-105 backdrop-blur-sm transform-gpu origin-center transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)]",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-4 py-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

OutlineAnimatedButton.displayName = "OutlineAnimatedButton";

const ButtonAnimationDemo = () => {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Button Animation Variants</h1>
        <p className="text-muted-foreground mb-8">
          Hover over each button to see the different animation effects
        </p>

        {/* Primary Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Primary Buttons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Current: Elevation
              </h3>
              <AnimatedButton variant="elevation">Pay Now</AnimatedButton>
              <p className="text-xs text-muted-foreground">
                Simple shadow elevation on hover
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Scale + Glow ⭐
              </h3>
              <AnimatedButton variant="scale-glow">Add to Cart</AnimatedButton>
              <p className="text-xs text-muted-foreground">
                Subtle scale + colored shadow glow
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Border Pulse
              </h3>
              <AnimatedButton variant="border-pulse">Checkout</AnimatedButton>
              <p className="text-xs text-muted-foreground">
                Ring effect on hover
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Gradient Shift
              </h3>
              <AnimatedButton variant="gradient-shift">
                Subscribe
              </AnimatedButton>
              <p className="text-xs text-muted-foreground">
                Gradient color transition
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Micro Transform
              </h3>
              <AnimatedButton variant="micro-transform">Buy Now</AnimatedButton>
              <p className="text-xs text-muted-foreground">
                Quick scale animation
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Product Card
              </h3>
              <AnimatedButton variant="product-card">
                Add to Cart
              </AnimatedButton>
              <p className="text-xs text-muted-foreground">
                No animation (for product cards)
              </p>
            </div>
          </div>

          {/* Cool Effects Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              🔥 Cool Effects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Magnetic Pull 🧲
                </h3>
                <AnimatedButton variant="magnetic">Hover Me</AnimatedButton>
                <p className="text-xs text-muted-foreground">
                  Lifts up with bouncy scale effect
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Neon Glow ✨
                </h3>
                <AnimatedButton variant="neon-glow">Glow Effect</AnimatedButton>
                <p className="text-xs text-muted-foreground">
                  Multi-layer neon glow animation
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Morphing Border 🔄
                </h3>
                <AnimatedButton variant="morphing">Transform</AnimatedButton>
                <p className="text-xs text-muted-foreground">
                  Animated border with pulse effect
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Glass Morph 🪟
                </h3>
                <AnimatedButton variant="glass-morph">
                  Glass Effect
                </AnimatedButton>
                <p className="text-xs text-muted-foreground">
                  Frosted glass with backdrop blur
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-sm text-muted-foreground">
                  Particle Burst 💥
                </h3>
                <AnimatedButton variant="particle-burst">
                  Burst Effect
                </AnimatedButton>
                <p className="text-xs text-muted-foreground">
                  Shimmer + radial burst animation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Outline Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Outline Buttons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Current: Elevation
              </h3>
              <OutlineAnimatedButton variant="elevation">
                Cancel
              </OutlineAnimatedButton>
              <p className="text-xs text-muted-foreground">
                Border change + shadow
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Scale + Glow ⭐
              </h3>
              <OutlineAnimatedButton variant="scale-glow">
                Learn More
              </OutlineAnimatedButton>
              <p className="text-xs text-muted-foreground">
                Scale + subtle glow
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Border Pulse
              </h3>
              <OutlineAnimatedButton variant="border-pulse">
                View Details
              </OutlineAnimatedButton>
              <p className="text-xs text-muted-foreground">Ring pulse effect</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Gradient Shift
              </h3>
              <OutlineAnimatedButton variant="gradient-shift">
                Contact Us
              </OutlineAnimatedButton>
              <p className="text-xs text-muted-foreground">
                Gradient border transition
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Micro Transform
              </h3>
              <OutlineAnimatedButton variant="micro-transform">
                Back
              </OutlineAnimatedButton>
              <p className="text-xs text-muted-foreground">Quick scale up</p>
            </div>
          </div>
        </section>

        {/* Usage Recommendations */}
        <section className="space-y-4 bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Usage Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-medium mb-2">
                Primary Actions (Scale + Glow ⭐)
              </h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Pay, Checkout, Buy Now</li>
                <li>• Add to Cart (in modals)</li>
                <li>• Subscribe, Sign Up</li>
                <li>• Submit forms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">
                Secondary Actions (Border Pulse)
              </h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Learn More, View Details</li>
                <li>• Contact, Support</li>
                <li>• Navigation buttons</li>
                <li>• Filter/Sort options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Minimal Actions (Elevation)</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Cancel, Back, Close</li>
                <li>• Settings, Preferences</li>
                <li>• Less important CTAs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">No Animation (Product Card)</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Product card buttons</li>
                <li>• Repeated UI elements</li>
                <li>• Grid/list item actions</li>
                <li>• When part of card design</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ButtonAnimationDemo;
