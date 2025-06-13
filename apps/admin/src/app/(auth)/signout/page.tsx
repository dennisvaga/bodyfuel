import React from "react";
import SignOut from "@repo/ui/components/features/auth/SignOut";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) => {
  const { callbackUrl } = await searchParams;
  return <SignOut callbackUrl={callbackUrl} />;
};

export default Page;
