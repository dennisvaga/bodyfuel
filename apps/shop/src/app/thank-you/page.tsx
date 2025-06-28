"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Component that uses useSearchParams must be wrapped in Suspense
const ThankYouContent = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const renderContent = () => {
    switch (type) {
      case "contact":
        return (
          <>
            <h1 className="text-4xl font-bold text-green-600">Thank You! 🎉</h1>
            <p className="text-lg mt-4">
              Your message has been successfully sent.
            </p>
            <p className="text-lg">
              We appreciate your feedback and will get back to you shortly.
            </p>
          </>
        );
      default:
        return (
          <>
            <h1 className="text-4xl font-bold text-green-600">Thank You! 🎉</h1>
            <p className="text-lg mt-4">
              Your order has been successfully placed.
            </p>
            <p className="text-lg">
              We appreciate your purchase and will process your order shortly.
            </p>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      {renderContent()}
    </div>
  );
};

// Main page component with Suspense boundary
const ThankYouPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
          Loading...
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
};

export default ThankYouPage;
