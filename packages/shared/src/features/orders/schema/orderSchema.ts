import z from "zod";

// Reusable required string helper
const requiredString = (fieldName: string) =>
  z.string().min(1, { message: `${fieldName} is required` });

// Order Item Schema
const OrderItemSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
  variantId: z.number().optional(), // Optional variant ID for products with variants
});

// Shipping Info Schema
const ShippingInfoSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  company: z.string().optional(),
  address: requiredString("Address"),
  apartment: z.string().optional(),
  city: requiredString("City"),
  state: z.string().optional(),
  postalCode: z.string(),
  countryId: z.coerce.number().min(1, "Country is required"),
  phone: requiredString("Phone number"),
});

// Frontend validation
export const OrderFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email" })
    .min(1, { message: "Email is required" }),
  shippingInfo: ShippingInfoSchema.optional(), // Optional for e-products
  // shippingMethod: z.string().optional(),
});

// Backend validation
export const OrderSchema = OrderFormSchema.extend({
  orderItems: z.array(OrderItemSchema).min(1),
});

// Initial Input from the user
export type OrderFormInput = z.infer<typeof OrderFormSchema>;

// After addition of items to the order
export type OrderInput = z.infer<typeof OrderSchema>;
