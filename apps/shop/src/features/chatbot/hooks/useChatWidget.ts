import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "@repo/ui/hooks/use-media-query";
import {
  loadFormDataFromLocalStorage,
  saveFormDataToLocalStorage,
} from "@repo/shared";

const CHAT_WIDGET_KEY = "chatWidgetOpen";

export function useChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWidgetInitialized, setIsWidgetInitialized] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize widget state from localStorage
  useEffect(() => {
    const savedState = loadFormDataFromLocalStorage<boolean>(CHAT_WIDGET_KEY);
    // Default to open (true) if no saved state exists
    setIsOpen(savedState !== null ? savedState : true);
    setIsWidgetInitialized(true);
  }, []);

  // Save widget state to localStorage
  useEffect(() => {
    if (isWidgetInitialized) {
      saveFormDataToLocalStorage(CHAT_WIDGET_KEY, isOpen);
    }
  }, [isOpen, isWidgetInitialized]);

  // Mobile keyboard visibility handler
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleFocus = () => {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    };

    const input = inputRef.current;
    input?.addEventListener("focus", handleFocus);

    return () => {
      input?.removeEventListener("focus", handleFocus);
    };
  }, [isMobile, isOpen]);

  // Handle browser back button to close chat widget
  useEffect(() => {
    if (!isOpen) return;

    const handlePopState = (event: PopStateEvent) => {
      // Close the chat widget when user presses browser back button
      setIsOpen(false);

      // Prevent the default back navigation
      window.history.pushState(null, "", window.location.href);
    };

    // Push a state when chat opens so back button can close it
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    isWidgetInitialized,
    isMobile,
    inputRef,
  };
}
