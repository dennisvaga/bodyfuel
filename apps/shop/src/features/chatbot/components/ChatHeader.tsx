import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { CardHeader } from "@repo/ui/components/ui/card";
import { X, ArrowLeft } from "lucide-react";
import { AnimatedRobotIcon } from "./AnimatedRobotIcon";

interface ChatHeaderProps {
  isMobile: boolean;
  onClose: () => void;
}

export function ChatHeader({ isMobile, onClose }: ChatHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-3 border-b border-border">
      {isMobile ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close chat"
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      ) : null}
      <div className="flex items-center gap-2">
        <AnimatedRobotIcon
          className="text-primary"
          size={24}
          enableGreeting={false}
          showCircle={false}
        />
        <h3 className="text-lg font-medium text-foreground">
          BodyFuel Assistant
        </h3>
      </div>
      {!isMobile ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <div className="w-4"></div> // Spacer for alignment
      )}
    </CardHeader>
  );
}
