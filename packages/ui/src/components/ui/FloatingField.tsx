import { FormControl, FormItem, FormMessage } from "./form";
import { Label } from "./label";
import { cn } from "#lib/cn";
import { ReactNode, useState, useEffect } from "react";
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
  // Add a mounted state to prevent initial animation
  const [labelReady, setLabelReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure label is positioned correctly
    const timer = setTimeout(() => {
      setLabelReady(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  const hasValue = (() => {
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
  })();

  return (
    <FormItem className={cn("relative w-full", !disabled && "group")}>
      <Label
        htmlFor={field.name}
        className={cn(
          "absolute left-3 text-gray-500 group-hover:cursor-text",
          // Initially invisible until ready
          !labelReady && "opacity-0",
          // Apply transitions to both opacity and position properties
          labelReady && "opacity-100 transition-all duration-200 ease-out",
          // Position the label correctly from the start if there's a value
          hasValue ? "top-[8px] text-xs text-gray-500" : "top-5"
        )}
      >
        {label}
      </Label>
      <FormControl>
        {children({
          id: field.name,
          className: cn("group-hover:cursor-text", hasValue && "pt-6 pb-1"),
          disabled,
          ...field,
        })}
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FloatingField;
