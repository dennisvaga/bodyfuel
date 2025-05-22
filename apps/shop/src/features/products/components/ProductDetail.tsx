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

const ProductDetail = ({ product, isLoading }: ProductDetailProps) => {
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
    <div className="flex flex-row justify-around w-full">
      <div className="w-full">
        <Product.Image width={500} src={product.images?.[0].imageUrl || "/"} />
      </div>
      <div className="flex flex-col relative w-full">
        <div className="flex flex-col gap-3 ">
          <Product.Name className="text-3xl font-bold" name={product.name} />
          <Product.Brand
            className="text-xl font-medium"
            brand={product?.brand ?? ""}
          />
          <Product.Price
            className="text-xl font-medium"
            price={product.price ?? 0}
          />
          <Product.Description
            className="text-md"
            description={product.description ?? ""}
          />
        </div>

        <div className="flex gap-2  pt-20">
          <Product.QuantityControls
            quantity={productInCart?.quantity || localQuantity}
            onChangeQuantity={handleQuantityChange}
          />
          <Product.AddToCartButton
            onClick={(e: any) => {
              handleAddToCart();
              e.stopPropagation();
            }}
            className={`w-full hover:cursor-pointer hover:bg-primary bottom-0 left-0 right-0 rounded-none font-semibold  md:block`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
