import { OrderInput } from "@repo/shared";

export function prepareOrderItems(
  orderData: OrderInput,
  productMap: Record<number, any>
) {
  // Calculate total price and prepare order items data
  let totalPrice = 0;
  const orderItemsData = orderData.orderItems.map((orderItem) => {
    const product = productMap[orderItem.productId];
    if (!product) {
      throw new Error(`Product with id ${orderItem.productId} not found`);
    }
    // Assuming orderItem.quantity is the quantity the user wants to order.
    totalPrice += orderItem.quantity * product.price;
    return {
      productId: product.id,
      quantity: orderItem.quantity, // Use the ordered quantity from the request
      price: product.price,
    };
  });

  return { orderItemsData, totalPrice };
}
