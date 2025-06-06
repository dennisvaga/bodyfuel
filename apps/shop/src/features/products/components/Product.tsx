/**
 * Compound component for building reusable Product cards.
 * Includes image, name, price, brand, quantity controls, and more.
 */

"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Label } from "@radix-ui/react-label";
import { PlusIcon, MinusIcon, ShoppingCart } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@/lib/utils";

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
}) => (
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
      <Image
        src={src || "/"}
        alt="Product Image"
        sizes={`${width}px`}
        fill
        className={cn(
          "object-contain",
          hoverEffect &&
            "transition-transform duration-500 transform group-hover:scale-105"
        )}
      />
    </div>
  </div>
);

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
      `text-base font-semibold text-[hsl(var(--product-name))] ${onClick ? "hover:cursor-pointer hover:text-primary transition-colors" : ""}`,
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
      "text-lg font-bold text-[hsl(var(--product-price))]",
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

// Add to Cart Button
Product.AddToCartButton = ({
  onClick,
  className,
  variant = "default",
  children,
}: {
  onClick: (e: any) => void;
  className?: string;
  variant?: "default" | "icon";
  children?: ReactNode;
}) => (
  <Button
    onClick={(e: React.MouseEvent) => {
      onClick(e);
      e.stopPropagation();
    }}
    className={className}
  >
    {variant === "icon" ? <ShoppingCart /> : children || "Add to Cart"}
  </Button>
);

// Quantity Controls
Product.QuantityControls = ({
  quantity,
  onChangeQuantity,
  className,
}: {
  quantity: number;
  onChangeQuantity: (quantity: number) => void;
  className?: string;
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
        className="flex items-center justify-center h-full w-10 p-0 border-0 dark:hover:bg-muted/50"
        variant="ghost"
        onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Number(e.target.value);
            if (value > 0) onChangeQuantity(value);
          }}
        />
      </div>
      <Button
        className="flex items-center justify-center h-full w-10 p-0 rounded-none border-0 dark:hover:bg-muted/50"
        variant="ghost"
        onClick={() => onChangeQuantity(quantity + 1)}
        type="button"
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Subtotal
Product.Subtotal = ({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) => (
  <Label
    className={cn(
      "text-base font-semibold text-[hsl(var(--product-price))]",
      className
    )}
  >
    Subtotal: ${amount.toFixed(2)}
  </Label>
);

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

export default Product;
