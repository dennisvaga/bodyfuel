import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { Button } from "@repo/ui/components/ui/button";
import { Menu } from "lucide-react";
import SidebarLinks from "./SidebarLinks";

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-2">
        <SheetHeader>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <SheetTitle></SheetTitle>
        <SidebarLinks onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
