"use client";

import CheckoutForm from "@/src/features/checkout/components/CheckoutForm";
import React from "react";
import logoBright from "@rootMedia/logo-bright.svg";
import logoDark from "@rootMedia/logo-dark.svg";
import Link from "next/link";
import Image from "next/image";
import { useThemeAwareLogo } from "@repo/ui/hooks/useThemeAwareLogo";
import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";

const Page = () => {
  const { logoSrc } = useThemeAwareLogo(logoBright, logoDark);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left main content*/}
      <div className="w-full">
        <div className="ml-auto max-w-[700px] w-full px-10 py-20">
          {/* Logo */}
          <div className="w-full pb-20 hidden md:flex">
            <Link href={"/"}>
              <Image
                priority
                className="w-[400px]"
                src={logoSrc}
                width={240}
                alt="BodyFuel Logo"
              />
            </Link>
          </div>

          {/* Form */}
          <CheckoutForm />
        </div>
      </div>

      {/* RIGHT: SIDEBAR, sticky at the top right, no extra padding */}
      <div className="w-full -order-1 md:order-1 bg-background">
        <aside className="sticky top-0 right-0 md:max-w-[380px] w-full px-10 pt-10">
          {/* Logo */}
          <div className="w-full pb-20 md:hidden">
            <Link href={"/"}>
              <Image
                priority
                className="w-[400px]"
                src={logoSrc}
                width={240}
                alt="BodyFuel Logo"
              />
            </Link>
          </div>

          {/* Cart items list */}
          <div className="flex flex-col gap-4 ">
            <CartItemsList
              variant={CartVariants.checkout}
              showSubtotalLabel={false}
            />
          </div>

          <div className="border-b border-gray-200 mt-8 md:hidden"></div>
        </aside>
      </div>
    </div>
  );
};

export default Page;
