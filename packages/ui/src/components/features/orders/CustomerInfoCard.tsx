"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Mail } from "lucide-react";

interface CustomerInfoCardProps {
  email: string;
  userId?: string | null;
}

/**
 * Card component to display customer information
 */
export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  email,
  userId,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start">
            <Mail className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          {userId && (
            <div className="flex items-start">
              <span className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground">
                ID:
              </span>
              <div>
                <p className="text-sm font-medium">User Account</p>
                <p className="text-sm text-muted-foreground break-all">
                  {userId}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
