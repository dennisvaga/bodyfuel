"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignOut = ({ callbackUrl }: { callbackUrl?: string }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    // signOut({ redirect: true, callbackUrl: callbackUrl ?? "/signin" });

    signOut({ redirect: false })
      .then(() => router.replace(callbackUrl ?? "/signin"))
      .catch((err) => {
        console.error("Failed to sign out:", err);
        router.replace(callbackUrl ?? "/signin");
      });
  }, [status]);

  return <p>Logging out...</p>;
};

export default SignOut;
