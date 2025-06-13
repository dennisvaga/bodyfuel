import { FormControl, FormItem, FormMessage } from "#components/ui/form";
import { Label } from "#components/ui/label";
import { cn } from "#lib/cn";
import {
  ReactNode,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { ControllerRenderProps } from "react-hook-form";

interface FloatingFieldProps {
  field: ControllerRenderProps<any>;
  label: string;
  disabled?: boolean;
  children: (
    props: {
      id: string;
      className: string;
      disabled: boolean;
      [key: string]: any; // Allow additional props like "aria-label"
    } & ControllerRenderProps<any>
  ) => ReactNode;
}

/**
 * Generic floating form field component that can wrap any input component.
 * Adds Label (Floating) into the field that moves up when typing.
 */
const FloatingField = ({
  field,
  label,
  disabled = false,
  children,
}: FloatingFieldProps) => {
  const [labelReady, setLabelReady] = useState(false);
  const [hasAutofill, setHasAutofill] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rafRef = useRef<number | null>(null);

  // Memoize hasValue calculation to prevent unnecessary recalculations
  const hasValue = useMemo(() => {
    const value = field.value;

    // Handle null and undefined
    if (value === null || value === undefined) {
      return false;
    }

    // Handle empty strings
    if (value === "") {
      return false;
    }

    // Handle arrays (empty arrays should be considered as no value)
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    // All other values (including 0, false, etc.) are considered valid
    return true;
  }, [field.value]);

  // Optimized autofill check with useCallback to prevent recreation
  const checkAutofill = useCallback(() => {
    const input = document.getElementById(field.name) as HTMLInputElement;
    if (!input) return;

    // Check for webkit autofill
    const isWebkitAutofill = input.matches(":-webkit-autofill");
    // Also check if the input has a value but we haven't detected it yet
    const hasUnexpectedValue = input.value && !hasValue && !isFocused;

    if (isWebkitAutofill || hasUnexpectedValue) {
      setHasAutofill(true);
      // Stop polling once autofill is detected to save resources
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (!input.value) {
      setHasAutofill(false);
    }
  }, [field.name, hasValue, isFocused]);

  // Label ready effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLabelReady(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  // Optimized autofill detection effect
  useEffect(() => {
    // Initial check
    checkAutofill();

    // Use RAF for immediate detection, but only one
    rafRef.current = requestAnimationFrame(checkAutofill);

    // Only set up polling if no autofill detected yet and reduce frequency
    if (!hasAutofill) {
      intervalRef.current = setInterval(checkAutofill, 500); // Reduced from 100ms to 500ms
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [checkAutofill, hasAutofill]);

  // Enhanced shouldFloat logic that considers focus state for smoother transitions
  const shouldFloat = hasValue || hasAutofill || isFocused;

  return (
    <FormItem className={cn("relative w-full", !disabled && "group")}>
      <Label
        htmlFor={field.name}
        className={cn(
          "absolute left-3 text-gray-500 group-hover:cursor-text pointer-events-none",
          // Initially invisible until ready
          !labelReady && "opacity-0",
          // Apply transitions to both opacity and position properties
          labelReady && "opacity-100 transition-all duration-200 ease-out",
          // Position the label correctly from the start if there's a value or autofill
          shouldFloat ? "top-[8px]" : "top-5"
        )}
        aria-hidden={shouldFloat}
      >
        {label}
      </Label>
      <FormControl>
        <div
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {children({
            id: field.name,
            className: cn(
              "group-hover:cursor-text transition-all duration-200 ease-out",
              shouldFloat && "pt-6 pb-1"
            ),
            disabled,
            "aria-label": shouldFloat ? undefined : label,
            ...field,
          })}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FloatingField;
