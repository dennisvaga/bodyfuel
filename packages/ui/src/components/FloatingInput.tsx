import React from "react";
import { Input } from "#components/ui/input";
import FloatingField from "#components/FloatingField";
import { ControllerRenderProps } from "react-hook-form";

interface FloatingInputProps {
  field: ControllerRenderProps<any>;
  label: string;
  disabled?: boolean;
}

const FloatingInput = React.memo(
  ({ field, label, disabled }: FloatingInputProps) => (
    <FloatingField field={field} label={label} disabled={disabled}>
      {(fieldProps) => <Input {...fieldProps} />}
    </FloatingField>
  )
);

export default FloatingInput;
