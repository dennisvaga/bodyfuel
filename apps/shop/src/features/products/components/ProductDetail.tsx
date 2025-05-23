/**
 * Product detail (Single) component rendered for each individual product.
 * Built using the <Product /> compound component.
 */

import { ProductWithImageUrl } from "@repo/database/types/product";
import React, { useState } from "react";
import Product from "./Product";
import { useCart } from "../../cart/contexts/cartContext";

interface ProductDetailProps {
  product: ProductWithImageUrl;
  isLoading: boolean;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { addToCart, changeQuantity, cart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  const productInCart = cart?.cartItems.find(
    (item) => item.productId === product.id
  );

  const handleAddToCart = async () => {
    if (product) {
      const result = await addToCart(
        product,
        productInCart?.quantity || localQuantity
      );

      if (!result.success) {
        console.error("Error adding product to cart:", result.message);
        return;
      }
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);

    if (productInCart) {
      // If product is in cart, update cart quantity
      changeQuantity(product.id, validQty);
    } else {
      // Otherwise just update local state
      setLocalQuantity(validQty);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around w-full gap-6 px-4 md:px-6 lg:px-8">
      <div className="w-full flex justify-center">
        <Product.Image
          width={500}
          src={product.images?.[0].imageUrl || "/"}
          className="max-w-full h-auto object-contain"
        />
      </div>
      <div className="flex flex-col relative w-full">
        <div className="flex flex-col gap-3">
          <Product.Name
            className="text-2xl md:text-3xl font-bold"
            name={product.name}
          />
          <Product.Brand
            className="text-lg md:text-xl font-medium"
            brand={product?.brand ?? ""}
          />
          <Product.Price
            className="text-lg md:text-xl font-medium"
            price={product.price ?? 0}
          />
          <Product.Description
            className="text-sm md:text-md"
            description={product.description ?? ""}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 mt-8 md:mt-16 md:items-center">
          <Product.QuantityControls
            quantity={
              productInCart !== undefined
                ? productInCart.quantity
                : localQuantity
            }
            onChangeQuantity={handleQuantityChange}
          />
          <Product.AddToCartButton
            onClick={(e: any) => {
              handleAddToCart();
              e.stopPropagation();
            }}
            className={`sm:max-w-[200px] w-full hover:cursor-pointer hover:bg-primary rounded-md md:rounded-none font-semibold`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
