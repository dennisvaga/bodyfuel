/**
 * Compound component for building reusable Product cards.
 * Includes image, name, price, brand, quantity controls, and more.
 */

"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { PlusIcon, MinusIcon, ShoppingCart, Star } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { cn } from "#lib/cn";
import LoadAnimation from "#components/LoadAnimation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeleton } from "#hooks/useSkeleton";

// Core Product compound component
const Product = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-row justify-between w-full", className)}>
      {children}
    </div>
  );
};

// Product Image
Product.Image = ({
  src,
  width,
  height,
  className,
  hoverEffect = false,
  onClick,
}: {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const { skeletonTheme } = useSkeleton();

  return (
    <div
      className={cn(
        `relative h-full flex items-center justify-center ${onClick ? "hover:cursor-pointer" : ""}`,
        className
      )}
      onClick={onClick}
    >
      <div
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        className={cn("relative", !height && "aspect-square")}
      >
        {/* Loading skeleton with proper theming */}
        {isLoading && (
          <SkeletonTheme {...skeletonTheme}>
            <Skeleton
              height="100%"
              width="100%"
              className="rounded-lg"
              style={{ position: "absolute", inset: 0 }}
            />
          </SkeletonTheme>
        )}

        {/* Error fallback */}
        {hasError && (
          <div className="absolute inset-0 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Image not found</div>
          </div>
        )}

        <Image
          src={src || "/"}
          alt="Product Image"
          sizes={`${width}px`}
          fill
          className={cn(
            "object-contain transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            hoverEffect &&
              "transition-transform duration-500 transform group-hover:scale-105"
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
};

// Product Name
Product.Name = ({
  name,
  className,
  onClick,
}: {
  name: string;
  className?: string;
  onClick?: () => void;
}) => (
  <Label
    className={cn(
      `text-md font-semibold text-[hsl(var(--product-name))] ${onClick ? "hover:cursor-pointer hover:text-primary transition-colors" : ""}`,
      className
    )}
    onClick={onClick}
  >
    {name}
  </Label>
);

// Product Price
Product.Price = ({
  price,
  className,
}: {
  price: number;
  className?: string;
}) => (
  <Label
    className={cn(
      "text-base font-bold text-[hsl(var(--product-price))]",
      className
    )}
  >
    ${price.toFixed(2)}
  </Label>
);

// Product Category
Product.Category = ({
  category,
  className,
}: {
  category: string;
  className?: string;
}) => (
  <Label
    className={cn(
      "text-xs font-medium text-[hsl(var(--product-category))] uppercase tracking-wider",
      className
    )}
  >
    {category}
  </Label>
);

// Product Brand
Product.Brand = ({
  brand,
  className,
}: {
  brand: string;
  className?: string;
}) => (
  <Label
    className={cn(
      "text-sm font-medium text-[hsl(var(--product-brand))]",
      className
    )}
  >
    {brand}
  </Label>
);

// Product Variant Options
Product.VariantOptions = ({
  variant,
  className,
}: {
  variant?: {
    variantOptionValues: Array<{
      optionValue: {
        value: string;
        option: {
          name: string;
        };
      };
    }>;
  } | null;
  className?: string;
}) => {
  if (!variant?.variantOptionValues?.length) return null;

  return (
    <div className={cn("text-sm text-[hsl(var(--product-brand))]", className)}>
      {variant.variantOptionValues.map((vov, index) => {
        const optionName = vov.optionValue?.option?.name;
        const optionValue = vov.optionValue?.value;

        if (!optionValue) return null;

        return (
          <div key={index}>
            {optionName ? `${optionName}: ${optionValue}` : optionValue}
          </div>
        );
      })}
    </div>
  );
};

// Add to Cart Button
Product.AddToCartButton = ({
  onClick,
  className,
  variant = "default",
  children,
  isLoading = false,
  disabled = false,
}: {
  onClick: (e: any) => void;
  className?: string;
  variant?: "default" | "icon";
  children?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}) => (
  <Button
    onClick={(e: React.MouseEvent) => {
      if (!isLoading && !disabled) {
        onClick(e);
        e.stopPropagation();
      }
    }}
    variant="product-card"
    className={className}
    disabled={isLoading || disabled}
  >
    {isLoading ? (
      <LoadAnimation className="text-white" />
    ) : variant === "icon" ? (
      <ShoppingCart />
    ) : (
      children || "Add to Cart"
    )}
  </Button>
);

// Quantity Controls
Product.QuantityControls = ({
  quantity,
  onChangeQuantity,
  className,
  isLoading = false,
}: {
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center border rounded-xl w-[120px] h-10",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        className="flex items-center justify-center h-full w-10 p-0 rounded-none border-0 hover:rounded-l-xl"
        variant="ghost"
        onClick={() =>
          !isLoading && onChangeQuantity(Math.max(1, quantity - 1))
        }
        type="button"
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <div className="flex-1 h-full border-l border-r">
        <Input
          type="number"
          className="h-full w-10 px-2 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          value={quantity}
          min={1}
          disabled={isLoading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (!isLoading) {
              const value = Number(e.target.value);
              if (value > 0) onChangeQuantity(value);
            }
          }}
        />
      </div>
      <Button
        className="flex items-center justify-center h-full w-10 p-0 rounded-none border-0 hover:rounded-r-xl"
        variant="ghost"
        onClick={() => !isLoading && onChangeQuantity(quantity + 1)}
        type="button"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Total/Subtotal Component (consolidated)
Product.Total = ({
  amount,
  label = "Total",
  labelSize = "base",
  priceSize = "base",
  className,
  isLoading = false,
  showLabel = true,
  priceColor = "text-[hsl(var(--product-price))]",
}: {
  amount: number;
  label?: string;
  labelSize?: "base" | "lg" | "xl";
  priceSize?: "base" | "lg" | "xl";
  className?: string;
  isLoading?: boolean;
  showLabel?: boolean;
  priceColor?: string;
}) => {
  const labelSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg font-semibold",
    xl: "text-xl font-bold",
  };

  const priceSizeClasses = {
    base: "!text-base !font-bold",
    lg: "!text-lg !font-semibold",
    xl: "!text-xl !font-bold",
  };

  return (
    <div className={cn("flex flex-row justify-between gap-2", className)}>
      {showLabel && (
        <Label className={labelSizeClasses[labelSize]}>{label}:</Label>
      )}
      <Label
        className={cn(
          priceSizeClasses[priceSize],
          "flex items-center gap-2",
          priceColor
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadAnimation size="md" />
          </div>
        ) : (
          `$${amount.toFixed(2)}`
        )}
      </Label>
    </div>
  );
};

// Description
Product.Description = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => (
  <div
    className={cn(
      "text-sm leading-relaxed text-[hsl(var(--product-description))]",
      className
    )}
  >
    {description}
  </div>
);

// Product Variant Selector
Product.VariantSelector = ({
  options,
  selectedOptions,
  onSelectionChange,
  className,
}: {
  options: Array<{
    id: number | string;
    name: string;
    optionValues: Array<{
      id: number | string;
      value: string;
    }>;
  }>;
  selectedOptions: Record<string, string>;
  onSelectionChange: (optionName: string, value: string) => void;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-4", className)}>
    {options.map((option) => (
      <div key={option.id} className="flex flex-col gap-2">
        <Label className="font-medium text-sm">{option.name}:</Label>
        <Select
          value={selectedOptions[option.name] || ""}
          onValueChange={(value) => onSelectionChange(option.name, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${option.name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {option.optionValues.map((value) => (
              <SelectItem key={value.id} value={value.value}>
                {value.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    ))}
  </div>
);

export default Product;
