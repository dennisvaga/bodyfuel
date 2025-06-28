import React from "react";
import SignIn from "@repo/ui/components/features/auth/SignIn";

const Page = async (props: {
  searchParams: Promise<{
    callbackUrl: string | undefined;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  return <SignIn isAdmin={true} isAdminApp={true} callbackUrl={callbackUrl} />;
};

export default Page;
