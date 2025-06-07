import { ControllerRenderProps } from "react-hook-form";
import FloatingField from "#components/FloatingField";
import { Textarea } from "#components/ui/textarea";
import React from "react";

interface FloatingTextareaProps {
  field: ControllerRenderProps<any>;
  label: string;
  disabled?: boolean;
}

const FloatingTextarea = React.memo(
  ({ field, label, disabled = false }: FloatingTextareaProps) => (
    <FloatingField field={field} label={label} disabled={disabled}>
      {(fieldProps) => (
        <Textarea
          {...fieldProps}
          className={`${fieldProps.className} resize-none ${field.value ? "!pt-6 !pb-2" : ""}`}
        />
      )}
    </FloatingField>
  )
);
export default FloatingTextarea;
