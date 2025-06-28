import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { ControllerRenderProps } from "react-hook-form";
import FloatingField from "#components/FloatingField";
import React, { useMemo } from "react";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

interface FloatingSelectProps {
  field: ControllerRenderProps<any>;
  label: string;
  selectOptions: { id: number; name: string }[];
  disabled?: boolean;
}

/**
 * Note: when user select value from the select, It selected as a string.
 * @param param0
 * @returns
 */
const FloatingSelect = React.memo(
  ({ field, label, selectOptions, disabled }: FloatingSelectProps) => {
    // Find selected option (memoized for performance)
    const selectedOption = useMemo(
      () => selectOptions.find((option) => option.id === field.value),
      [selectOptions, field.value]
    );

    // Handler for selection changes (memoized to avoid recreating on each render)
    const handleValueChange = React.useCallback(
      (value: string) => {
        field.onChange(Number(value));
      },
      [field]
    );

    // Virtual list item renderer with proper TypeScript types
    const ItemRenderer = React.useCallback(
      ({ index, style }: ListChildComponentProps) => {
        const option = selectOptions[index];

        return (
          <SelectItem
            key={option.id}
            value={option.id.toString()}
            style={{
              ...style,
              // Override any styles that might interfere with selection
              pointerEvents: "auto",
            }}
            onSelect={(event) => {
              // Stop propagation to prevent conflicts
              event.stopPropagation();
              event.preventDefault();
              handleValueChange(option.id.toString());
            }}
          >
            {option.name}
          </SelectItem>
        );
      },
      [selectOptions, handleValueChange, field.value]
    );

    return (
      <FloatingField field={field} label={label} disabled={disabled}>
        {(fieldProps) => (
          <Select
            value={field.value?.toString()}
            onValueChange={handleValueChange}
            disabled={fieldProps.disabled}
          >
            <SelectTrigger
              className={`${fieldProps.className}`}
              id={fieldProps.id}
            >
              <SelectValue>
                <span className="block truncate">{selectedOption?.name}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <div className="py-1">
                <List
                  height={Math.min(35 * selectOptions.length, 300)} // Max height 300px
                  itemCount={selectOptions.length}
                  itemSize={35} // Height of each item
                  width="100%"
                  className="select-none"
                  // Allow events to pass through to children
                  style={{ pointerEvents: "auto" }}
                >
                  {ItemRenderer}
                </List>
              </div>
            </SelectContent>
          </Select>
        )}
      </FloatingField>
    );
  }
);

FloatingSelect.displayName = "FloatingSelect";

export default FloatingSelect;
