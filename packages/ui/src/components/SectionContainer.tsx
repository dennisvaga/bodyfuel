import { cn } from "#lib/cn";
import React, { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
}

export function SectionContainer({
  children,
  className = "",
}: SectionContainerProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-[4rem] md:py-[6rem]",
        className
      )}
    >
      {children}
    </section>
  );
}
