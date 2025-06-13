"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCart } from "../../cart/contexts/cartContext";
import {
  OrderInput,
  OrderFormSchema,
  OrderFormInput,
  orderService,
  useEntitySubmit,
  ENTITY_TYPES,
} from "@repo/shared";
import {
  clearFormDataFromLocalStorage,
  loadFormDataFromLocalStorage,
  saveFormDataToLocalStorage,
} from "@repo/shared";
import { useFormToast } from "@repo/ui/hooks/useFormToast";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const FORM_DATA_KEY = "checkout_form_data";

const initCheckoutForm = (session: Session | null): OrderFormInput => ({
  email: session?.user?.email || "",
  shippingInfo: {
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    countryId: 2,
    phone: "",
  },
});

/**
 * checkout hook
 * @returns
 */
export function useCheckoutForm() {
  const { showSuccessToast, showErrorToast } = useFormToast();
  const { cart, total } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  // Initialize form with optimized validation settings
  const form = useForm<OrderFormInput>({
    mode: "onBlur",
    reValidateMode: "onBlur", // Prevent validation on every keystroke
    shouldUnregister: false,
    shouldFocusError: false, // Prevent unnecessary focus changes
    resolver: zodResolver(OrderFormSchema),
    defaultValues: initCheckoutForm(session),
  });

  const formValues = form.watch();

  // Track if form has been loaded from localStorage
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  // Load Form saved data from LocalStorage
  // This is used to prevent hydration errors
  useEffect(() => {
    const savedData =
      loadFormDataFromLocalStorage<OrderFormInput>(FORM_DATA_KEY);
    if (savedData) {
      form.reset(savedData); // Hydrate the form
    }
    setIsFormLoaded(true);
  }, []); // run once after mount

  // Save form data to LocalStorage with debouncing
  // Only save after the form has been loaded to prevent overwriting saved data
  useEffect(() => {
    if (!isFormLoaded) return;

    const timeoutId = setTimeout(() => {
      saveFormDataToLocalStorage(FORM_DATA_KEY, formValues);
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [formValues, isFormLoaded]);

  // Use shared submission logic
  const { handleSubmit, isSubmitting } = useEntitySubmit({
    entityType: ENTITY_TYPES.CHECKOUT,
    addEntity: (data: OrderInput) => orderService.addOrder(data),
    onSuccess: () => {
      clearFormDataFromLocalStorage(FORM_DATA_KEY);
      router.push("/thank-you");
    },
    showSuccessToast,
    showErrorToast,
  });

  async function onSubmit(data: OrderFormInput) {
    if (!cart?.cartItems) return;

    // Add Order Items
    const order: OrderInput = {
      ...data,
      orderItems: cart?.cartItems.map((cartItem) => ({
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        variantId: cartItem.variantId || undefined, // Include variantId for products with variants
      })),
    };

    await handleSubmit(order);
  }

  return {
    form,
    onSubmit,
    cart,
    total,
    isSubmitting,
  };
}
