import React, { ReactNode } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { PrimaryAction } from "@/src/types/table";
import Link from "next/link";

const TableLayout = ({
  heading,
  children,
  primaryAction,
}: {
  heading: string;
  children: ReactNode;
  primaryAction?: PrimaryAction;
}) => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Label className="text-4xl">
            {heading.charAt(0).toUpperCase() + heading.slice(1)}
          </Label>
          {primaryAction && (
            // Navigation case - wrap Button in Link
            <div className="hidden md:flex gap-2">
              {primaryAction.href ? (
                <Link href={primaryAction.href}>
                  <Button
                    size="sm"
                    variant={primaryAction.variant || "outline"}
                  >
                    <primaryAction.icon className="h-3.5 w-3.5" />
                    {primaryAction.label}
                  </Button>
                </Link>
              ) : (
                // Action case - Button with onClick
                <Button
                  size="sm"
                  variant={primaryAction.variant || "outline"}
                  onClick={primaryAction.onClick}
                >
                  <primaryAction.icon className="h-3.5 w-3.5" />
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TableLayout;
