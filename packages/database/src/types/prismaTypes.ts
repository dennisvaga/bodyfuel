// This file contains TypeScript types that match the Prisma schema for the database.

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED",
}

export interface ShippingInfo {
  id: string;
  firstName: string;
  lastName: string;
  company: string | null;
  address: string;
  apartment: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  countryId: number;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Country {
  id: number;
  code: string;
  name: string;
  isShippingAvailable: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}
