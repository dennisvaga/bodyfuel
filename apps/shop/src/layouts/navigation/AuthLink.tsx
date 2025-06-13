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
import { cn } from "@repo/ui/lib/cn";

interface AuthLinkProps {
  className?: string;
  onClick?: () => void; // Add onClick handler prop
  displayText?: boolean; // Optional prop to override default text
}

export const AuthLink = ({
  className,
  onClick,
  displayText = false,
}: AuthLinkProps) => {
  const { status } = useSession();
  const pathname = usePathname();

  // Determine text to show based on authentication status
  const text = status === SessionStatus.UNAUTHENTICATED ? "Login" : "Account";

  return (
    <Link
      className={cn(`flex flex-row gap-5 items-center`, className)}
      href={
        status === SessionStatus.UNAUTHENTICATED
          ? `/signin?callbackUrl=${encodeURIComponent(pathname)}`
          : "/dashboard"
      }
      onClick={onClick}
    >
      {displayText && <span className="min-w-[55px] truncate">{text}</span>}
      <User />
    </Link>
  );
};

export default AuthLink;
