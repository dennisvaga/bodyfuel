"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChatProductCardProps } from "../components/ChatProductCard";
import { JSONValue } from "ai";

export function useProductChat() {
  const [processingMessages, setProcessingMessages] = useState<boolean>(false);
  const latestMessageRef = useRef<string | null>(null);
  const [streamedProducts, setStreamedProducts] = useState<
    Omit<ChatProductCardProps, "className">[]
  >([]);
  const [productStatus, setProductStatus] = useState<string>("");

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    isLoading,
    setMessages,
    data,
    setData,
  } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi there! I can help you find products or answer questions about BodyFuel. What are you looking for today?",
      },
    ],
    api: `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
    onError: (error) => {
      console.error("Chat error:", error);
      setProcessingMessages(false);
    },
    streamProtocol: "data",
    onResponse: (response) => {
      // Check if the response contains streaming product data
      if (response.headers.get("X-Streaming-Products") === "true") {
        console.log("Detected streaming products response");
      }
    },
  });

  // Track product slugs to prevent duplicates
  const productSlugsRef = useRef<Set<string>>(new Set());

  // Process streamed data from the server
  useEffect(() => {
    if (!data || data.length === 0) {
      // Reset products when starting a new conversation
      setStreamedProducts([]);
      setProductStatus("");
      productSlugsRef.current.clear();
      return;
    }

    // Process each data item
    for (const item of data) {
      if (typeof item === "object" && item !== null) {
        // Handle product data
        if ("type" in item && item.type === "product" && "products" in item) {
          console.log("Received product data:", item.products);

          // Filter out products we've already seen
          const newProducts = (item.products as any[]).filter((product) => {
            if (!product.slug || productSlugsRef.current.has(product.slug)) {
              return false;
            }
            productSlugsRef.current.add(product.slug);
            return true;
          });

          if (newProducts.length > 0) {
            setStreamedProducts((prev) => [...prev, ...newProducts]);
          }
        }

        // Handle status updates
        if ("type" in item && item.type === "status" && "message" in item) {
          console.log("Status update:", item.message);
          setProductStatus(item.message as string);

          // If we get a "complete" status, we know all products have been sent
          if ("status" in item && item.status === "complete") {
            console.log("Product streaming complete");
          }
        }
      }
    }
  }, [data]);

  // Set processing state when new messages are being received
  useEffect(() => {
    if (isLoading) {
      setProcessingMessages(true);
    } else {
      // Immediately set processing to false when loading is done
      setProcessingMessages(false);
    }
  }, [isLoading]);

  // Function to extract and parse product data from message content
  const extractProductData = useCallback((text: string) => {
    // Use a global regex to find all product-data and product-stream tags
    const productDataPattern = /<product-data>([^]*?)<\/product-data>/g;
    const productStreamPattern = /<product-stream>([^]*?)<\/product-stream>/g;

    let match;
    let allProductData: Omit<ChatProductCardProps, "className">[] = [];
    let lastEndIndex = 0;
    let firstStartIndex = -1;

    // First, find all product-data tags and extract their content
    while ((match = productDataPattern.exec(text)) !== null) {
      try {
        // Parse the JSON data
        const productData = JSON.parse(match[1]) as Omit<
          ChatProductCardProps,
          "className"
        >[];

        // Add to the combined product data
        allProductData = [...allProductData, ...productData];

        // Track the position of the first product-data tag
        if (firstStartIndex === -1) {
          firstStartIndex = match.index;
        }

        // Track the end of the last product-data tag
        lastEndIndex = match.index + match[0].length;
      } catch (error) {
        console.error("Error parsing product data:", error);
      }
    }

    // Then, find all product-stream tags and extract their content
    while ((match = productStreamPattern.exec(text)) !== null) {
      try {
        // Parse the JSON data
        const productData = JSON.parse(match[1]) as Omit<
          ChatProductCardProps,
          "className"
        >[];

        // Add to the combined product data
        allProductData = [...allProductData, ...productData];

        // Track the position of the first product tag if not set yet
        if (firstStartIndex === -1) {
          firstStartIndex = match.index;
        }

        // Track the end of the last product tag
        lastEndIndex = match.index + match[0].length;
      } catch (error) {
        console.error("Error parsing product stream data:", error);
      }
    }

    if (allProductData.length > 0) {
      // Extract text content before the first product tag and after the last one
      const beforeData =
        firstStartIndex > 0 ? text.substring(0, firstStartIndex).trim() : "";

      // For the after data, we need to remove any product-data or product-stream tags
      let afterData =
        lastEndIndex < text.length ? text.substring(lastEndIndex).trim() : "";

      // Remove any HTML tags that might be in the text
      afterData = afterData.replace(/<[^>]*>/g, "");

      console.log(`Extracted ${allProductData.length} products from message`);

      return {
        productData: allProductData,
        beforeData,
        afterData,
        hasProductData: true,
      };
    }

    return { hasProductData: false };
  }, []);

  // Custom submit handler to set processing state
  const customHandleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setProcessingMessages(true);
      handleSubmit(e);
    },
    [handleSubmit]
  );

  // Function to clear streamed products
  const clearStreamedProducts = useCallback(() => {
    setStreamedProducts([]);
    setProductStatus("");
    setData(undefined); // Clear the data array
    productSlugsRef.current.clear(); // Clear the set of seen product slugs
  }, [setData]);

  // Reset products when submitting a new message
  const customHandleSubmitWithReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      setProcessingMessages(true);
      clearStreamedProducts();
      handleSubmit(e);
    },
    [handleSubmit, clearStreamedProducts]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit: customHandleSubmitWithReset,
    error,
    reload,
    isLoading,
    processingMessages,
    extractProductData,
    streamedProducts,
    productStatus,
    clearStreamedProducts,
  };
}
