"use client";

import React, { useEffect, useState } from "react";
import { FormField } from "@repo/ui/components/ui/form";
import { useFormContext, useWatch } from "react-hook-form";
import {
  countryService,
  OrderFormInput,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import FloatingInput from "@repo/ui/components/FloatingInput";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import FloatingSelect from "@repo/ui/components/FloatingSelect";

export const CheckoutDetails = () => {
  const { control, setValue } = useFormContext<OrderFormInput>();
  const { data: session, status } = useSession();
  const authenticated = status === "authenticated";
  const pathname = usePathname();

  // Get countries data
  const { data: countriesData } = useFetchQuery({
    queryKey: QUERY_KEYS.COUNTRIES,
    serviceFn: countryService.getCountries,
  });

  // Memoize the countries array for components
  const countries = React.useMemo(() => countriesData ?? [], [countriesData]);

  const countryId = useWatch({
    control,
    defaultValue: 2,
    name: "shippingInfo.countryId",
  });

  // Memoize the country code lookup to prevent unnecessary calculations
  const countryCode = React.useMemo(
    () => countries?.find((country) => country.id === countryId)?.code,
    [countries, countryId]
  );

  // Set form value and trigger validation when email is from session
  useEffect(() => {
    if (authenticated && session?.user?.email) {
      setValue("email", session.user.email, { shouldValidate: true });
    }
  }, [authenticated, session?.user?.email, setValue]);

  return (
    <>
      {/* Login */}
      <div className="flex flex-row justify-between ">
        <h1 className="text-2xl"> Contact </h1>
        {!authenticated ? (
          <Link
            className="custom-link"
            href={`/signin?callbackUrl=${encodeURIComponent(pathname)}`}
          >
            Login
          </Link>
        ) : (
          <Link
            className="custom-link"
            href={`/signout?callbackUrl=${encodeURIComponent(pathname)}`}
          >
            Logout
          </Link>
        )}
      </div>
      {/* Email */}
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FloatingInput
            field={field}
            label={"Email"}
            disabled={authenticated}
          />
        )}
      />

      <h1 className="text-2xl pt-4"> Delivery </h1>
      <FormField
        control={control}
        name="shippingInfo.countryId"
        render={({ field }) => (
          <FloatingSelect
            field={field}
            label="Countries"
            selectOptions={countries ?? []}
          />
        )}
      />
      <div className="flex flex-row gap-4">
        <FormField
          control={control}
          name="shippingInfo.firstName"
          render={({ field }) => (
            <FloatingInput field={field} label="First Name" />
          )}
        />

        <FormField
          control={control}
          name="shippingInfo.lastName"
          render={({ field }) => (
            <FloatingInput field={field} label="Last Name" />
          )}
        />
      </div>
      <FormField
        control={control}
        name="shippingInfo.company"
        render={({ field }) => (
          <FloatingInput field={field} label="Company (Optional)" />
        )}
      />
      <FormField
        control={control}
        name="shippingInfo.address"
        render={({ field }) => <FloatingInput field={field} label="Address" />}
      />
      <FormField
        control={control}
        name="shippingInfo.apartment"
        render={({ field }) => (
          <FloatingInput field={field} label="Apartment (Optional)" />
        )}
      />
      <div className="flex lg:flex-row flex-col gap-4">
        <FormField
          control={control}
          name="shippingInfo.city"
          render={({ field }) => <FloatingInput field={field} label="City" />}
        />

        {countryCode === "US" && (
          <FormField
            control={control}
            name="shippingInfo.state"
            render={({ field }) => (
              <FloatingInput field={field} label="State" />
            )}
          />
        )}

        <FormField
          control={control}
          name="shippingInfo.postalCode"
          render={({ field }) => (
            <FloatingInput
              field={field}
              label={
                countryCode === "US"
                  ? "Zip Code (Optional)"
                  : "Postal Code (Optional)"
              }
            />
          )}
        />
      </div>
      <FormField
        control={control}
        name="shippingInfo.phone"
        render={({ field }) => <FloatingInput field={field} label="Phone" />}
      />
    </>
  );
};
