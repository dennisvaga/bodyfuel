import React, { ReactNode } from "react";
import { Label } from "@repo/ui/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

const TableLayout = ({
  heading,
  children,
  showButton = true,
}: {
  heading: string;
  children: ReactNode;
  showButton?: boolean;
}) => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Label className="text-4xl">
            {heading.charAt(0).toUpperCase() + heading.slice(1)}
          </Label>
          {showButton && (
            <Link href={`/${heading}/new`}>
              <Button variant="outline">
                <PlusCircle className="h-3.5 w-3.5" />
                {`Add ${heading.slice(0, -1)}`}
              </Button>
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default TableLayout;
