"use client";

import { useCallback, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ProductInput, ProductOptionInput } from "@repo/shared";
import { v4 as uuidv4 } from "uuid";

export function useProductOptions() {
  const { control, setValue, trigger } = useFormContext<ProductInput>();
  const [addOptionBtnVisible, setAddOptionBtnVisible] = useState(true);

  const options: ProductOptionInput[] = useWatch({ control, name: "options" }) || [];

  // Product option added dynamically, this will expand another option.
  const addProductOption = () => {
    setValue("options", [
      ...options,
      { id: uuidv4(), name: "", optionValues: [{ id: uuidv4(), value: "" }] },
    ]);
    setAddOptionBtnVisible(false);
  };

  // Add a new value to a specific option
  const addProductOptionValue = (optIdx: number) => {
    const updatedOptions = [...options];
    updatedOptions[optIdx]?.optionValues?.push({ id: uuidv4(), value: "" }); // Add an empty string to the values array
    setValue("options", updatedOptions);
  };

  // Remove value from option
  const removeProductOptionValue = (optIdx: number, valIdx: number) => {
    const currentOptions = [...options];
    currentOptions?.[optIdx]?.optionValues.splice(valIdx, 1);
    setValue("options", currentOptions);
  };

  // Remove value from option
  const removeProductOption = (optIdx: number) => {
    const currentOptions = [...options];
    currentOptions?.splice(optIdx, 1);
    setValue("options", currentOptions);
  };

  // set option 'added'  to true
  const setOptionAdded = (optIdx: number, value: boolean) => {
    const updatedOptions = options.map((opt, idx) =>
      idx === optIdx ? { ...opt, added: value } : opt
    );
    setValue("options", updatedOptions);
    setAddOptionBtnVisible(true);
  };
  return {
    options,
    addProductOption,
    addProductOptionValue,
    removeProductOptionValue,
    removeProductOption,
    setOptionAdded,
    addOptionBtnVisible,
    setAddOptionBtnVisible,
    trigger,
  };
}

export default useProductOptions;
