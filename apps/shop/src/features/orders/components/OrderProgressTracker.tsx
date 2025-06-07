import { OrderStatus } from "@repo/database/types/prismaTypes";
import { Package, Truck, CheckCircle } from "lucide-react";

interface OrderProgressTrackerProps {
  status: OrderStatus;
}

/**
 * Displays a visual representation of order progress
 * Shows different stages of an order from Processing to Delivered
 * Visually indicates the current stage with colored circles and a progress line
 */
const OrderProgressTracker = ({ status }: OrderProgressTrackerProps) => {
  /**
   * Converts OrderStatus enum to a numeric step value
   * Used to determine visual progress indicators
   * @param status - The current order status from the database
   * @returns A number representing the progress step (1-3) or -1 for cancelled orders
   */
  const getStatusStepNumber = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 1; // First step - Processing
      case OrderStatus.PAID:
        return 2; // Second step - Shipped
      case OrderStatus.SHIPPED:
        return 3; // Third step - Delivered
      case OrderStatus.CANCELLED:
        return -1; // Special case - Cancelled order
      default:
        return 0; // Fallback for unknown statuses
    }
  };

  const statusStep = getStatusStepNumber(status);

  // Don't render the tracker for cancelled orders
  if (status === OrderStatus.CANCELLED) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="font-medium mb-4 text-3xl">Order Progress</h3>
      <div className="relative">
        {/* Step indicators with icons - each circle represents an order stage */}
        <div className="flex items-center justify-between mb-2">
          {/* Step 1: Processing */}
          <div className="flex flex-col items-center">
            <div
              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center  ${
                statusStep >= 1 ? "bg-primary text-white" : "bg-gray-600"
              }`}
            >
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Processing</span>
          </div>

          {/* Step 2: Shipped */}
          <div className="flex flex-col items-center">
            <div
              className={`z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                statusStep >= 2
                  ? "bg-primary text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Shipped</span>
          </div>

          {/* Step 3: Delivered */}
          <div className="flex flex-col items-center">
            <div
              className={`z-10  w-10 h-10 rounded-full flex items-center justify-center ${
                statusStep >= 3
                  ? "bg-primary text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Delivered</span>
          </div>
        </div>

        {/* Horizontal progress line connecting the step circles
           - Gray background represents the total progress path
           - Colored overlay shows current progress */}
        <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 z-0">
          {/* Progress indicator - width changes based on current step */}
          <div
            className="h-full bg-primary transition-all"
            style={{
              width:
                statusStep === 1
                  ? "0%" // No progress line for first step
                  : statusStep === 2
                    ? "50%" // Half-way for second step
                    : statusStep === 3
                      ? "100%" // Full progress for final step
                      : "0%", // Default/fallback
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OrderProgressTracker;
