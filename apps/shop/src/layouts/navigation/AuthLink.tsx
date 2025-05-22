/**
 * Authentication-aware link component.
 * Redirects users to different URLs based on their auth status.
 */

"use client";
import { User } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { SessionStatus } from "@repo/shared";

export const AuthLink = ({ className = "" }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <Link
      className={`flex flex-row gap-2 items-center ${className}`}
      href={
        status === SessionStatus.UNAUTHENTICATED
          ? `/signin?callbackUrl=${encodeURIComponent(pathname)}`
          : "/dashboard"
      }
    >
      <User />
    </Link>
  );
};

export default AuthLink;
