"use client";

import React, { useState } from "react";
import { cn } from "@repo/ui/lib/cn";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ChatProductCardProps {
  name: string;
  price: number;
  imageUrl?: string; // Make optional to match Product interface
  slug: string;
  className?: string;
  onProductClick?: () => void;
}

/**
 * Interactive card component for displaying product information in chat results
 *
 * Renders a compact product card with image, name, and price that navigates
 * to the product detail page when clicked. Handles image loading states and
 * fallbacks for missing images.
 */
export function ChatProductCard({
  name,
  price,
  imageUrl,
  slug,
  className,
  onProductClick,
}: ChatProductCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    router.push(`/products/${slug}`);
    onProductClick?.(); // Close the chatbot when product is clicked
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-accent rounded-md transition-colors",
        className
      )}
    >
      <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 bg-muted">
        {!imageError ? (
          <Image
            src={imageUrl || "/media/blankImage.jpg"}
            alt={name}
            width={40}
            height={40}
            className={cn(
              "object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            priority
          />
        ) : (
          <Image
            src="/media/blankImage.jpg"
            alt="Product image"
            width={40}
            height={40}
            className="object-cover"
            priority
          />
        )}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <p className="font-medium truncate text-sm text-foreground">{name}</p>
        <p className="text-primary font-semibold text-sm">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
