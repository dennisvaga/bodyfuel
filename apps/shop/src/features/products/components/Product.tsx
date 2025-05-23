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
            "transition-transform duration-500 transform group-hover:scale-110"
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
      `text-md font-normal ${onClick ? "hover:cursor-pointer" : ""}`,
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
  <Label className={cn("text-base font-medium", className)}>${price}</Label>
);

// Product Category
Product.Category = ({
  category,
  className,
}: {
  category: string;
  className?: string;
}) => (
  <Label className={cn("text-base text-gray-500", className)}>{category}</Label>
);

// Product Brand
Product.Brand = ({
  brand,
  className,
}: {
  brand: string;
  className?: string;
}) => <Label className={cn("text-sm text-gray-500", className)}>{brand}</Label>;

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
      className={cn("flex flex-row items-center border", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        className="hover:bg-transparent hover:cursor-pointer"
        variant="ghost"
        onClick={() => onChangeQuantity(quantity - 1)}
      >
        <MinusIcon width={10} height={10} />
      </Button>
      <Input
        type="number"
        className="text-base w-10 h-10 text-center border-y-0"
        value={quantity}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeQuantity(Number(e.target.value))
        }
      />
      <Button
        className="hover:bg-transparent hover:cursor-pointer"
        variant="ghost"
        onClick={() => onChangeQuantity(quantity + 1)}
      >
        <PlusIcon width={10} height={10} />
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
}) => <Label className={cn("text-sm", className)}>Subtotal: ${amount}</Label>;

// Description
Product.Description = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => <div className={cn("text-md", className)}>{description}</div>;

export default Product;

// // Add this to Product.tsx
// Product.ClickableWrapper = ({
//   children,
//   onClick,
//   className,
// }: {
//   children: ReactNode;
//   onClick: (e: React.MouseEvent) => void;
//   className?: string;
// }) => (
//   <div
//     onClick={onClick}
//     className={cn("hover:cursor-pointer [&_*]:cursor-pointer", className)}
//   >
//     {children}
//   </div>
// );
