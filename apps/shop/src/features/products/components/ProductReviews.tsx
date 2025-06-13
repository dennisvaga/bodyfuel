/**
 * ProductReviews component that generates consistent dummy reviews based on product ID
 */

"use client";

import { Star } from "lucide-react";
import { cn } from "@repo/ui/lib/cn";

interface ProductReviewsProps {
  productId: string | number;
  className?: string;
}

const ProductReviews = ({ productId, className }: ProductReviewsProps) => {
  // Generate consistent review data based on product ID
  const generateConsistentReviews = (id: string | number) => {
    // Convert ID to string and create a simple hash
    const idString = String(id);
    let hash = 0;
    for (let i = 0; i < idString.length; i++) {
      const char = idString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use hash to generate consistent but varied data
    const absHash = Math.abs(hash);

    // Generate rating between 4.6 and 5.0
    const ratingVariation = (absHash % 40) / 100; // 0.00 to 0.39
    const rating = 4.6 + ratingVariation;

    // Generate review count between 50 and 250
    const countVariation = absHash % 200; // 0 to 199
    const count = 50 + countVariation;

    return {
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      count,
    };
  };

  const { rating, count } = generateConsistentReviews(productId);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars - using a more subtle orange-gold color
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-amber-300/60 text-amber-300/60" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-3 w-3 text-muted-foreground/30" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-3 w-3 fill-amber-300/60 text-amber-300/60" />
          </div>
        </div>
      );
    }

    // Empty stars - using muted foreground for better integration
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-3 w-3 text-muted-foreground/30" />
      );
    }

    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">{renderStars(rating)}</div>
      <span className="text-xs text-[hsl(var(--product-description))] ml-1">
        {rating} ({count})
      </span>
    </div>
  );
};

export default ProductReviews;
