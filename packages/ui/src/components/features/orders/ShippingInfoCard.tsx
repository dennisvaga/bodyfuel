"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ShippingInfo } from "@prisma/client";
import { MapPin, Phone, Truck, Clock } from "lucide-react";

interface ShippingInfoCardProps {
  shippingInfo: ShippingInfo | null;
  shippingMethod?: string | null;
  estimatedDelivery?: Date | null;
}

/**
 * Card component to display shipping information
 */
export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({
  shippingInfo,
  shippingMethod,
  estimatedDelivery,
}) => {
  if (!shippingInfo) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {shippingInfo.address}
              </p>
              {shippingInfo.apartment && (
                <p className="text-sm text-muted-foreground">
                  {shippingInfo.apartment}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {shippingInfo.city}, {shippingInfo.state || ""}{" "}
                {shippingInfo.postalCode}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">
                {shippingInfo.phone}
              </p>
            </div>
          </div>
          {shippingMethod && (
            <div className="flex items-start">
              <Truck className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Shipping Method</p>
                <p className="text-sm text-muted-foreground">
                  {shippingMethod}
                </p>
              </div>
            </div>
          )}
          {estimatedDelivery && (
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
