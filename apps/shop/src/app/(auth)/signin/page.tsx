import React from "react";
import SignIn from "@repo/ui/components/features/auth/SignIn";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;

  return <SignIn callbackUrl={callbackUrl} />;
};

export default Page;
