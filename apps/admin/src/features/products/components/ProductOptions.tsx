"use client";

import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Label } from "@repo/ui/components/ui/label";
import { Separator } from "@repo/ui/components/ui/separator";
import { Ghost, PlusCircle, Trash2Icon } from "lucide-react";
import { FormField } from "@repo/ui/components/ui/form";
import { Button } from "@repo/ui/components/ui/button";
import FloatingInput from "@repo/ui/components/FloatingInput";
import Link from "next/link";
import useProductOptions from "../hooks/useProductOptions";

const ProductOptions = () => {
  const {
    options,
    addProductOption,
    addProductOptionValue,
    removeProductOptionValue,
    removeProductOption,
    setOptionAdded,
    addOptionBtnVisible,
    setAddOptionBtnVisible,
    trigger,
  } = useProductOptions();

  return (
    <Card className="flex flex-col gap-4">
      {/* Product options */}
      {options?.map((opt, optIdx) => {
        // Show added options
        if (opt.added) {
          return (
            <div
              className="hover:bg-slate-500 hover:bg-opacity-40 hover:cursor-pointer"
              key={optIdx}
              // Edit option
              onClick={() => setOptionAdded(optIdx, false)}
            >
              <div className="px-6 py-2">{opt.name}</div>
              <div className="px-6 py-2 flex gap-2">
                {opt.optionValues.map(({ value }: any, idx: number) => (
                  <Label key={idx} className="text-sm">
                    {value}
                  </Label>
                ))}
              </div>
              <Separator orientation="horizontal" />
            </div>
          );
        } else {
          // Show fields to add an option
          return (
            <CardContent key={optIdx} className="flex flex-col gap-4 pt-4">
              {/* Option Name Field */}
              <FormField
                name={`options.${optIdx}.name`}
                render={({ field }) => (
                  <FloatingInput field={field} label="Option Name" />
                )}
              />

              {/* Option values */}
              {opt.optionValues?.map((_, valIdx) => (
                <div key={valIdx} className="relative flex flex-col">
                  <FormField
                    name={`options.${optIdx}.optionValues.${valIdx}.value`}
                    render={({ field }) => (
                      <FloatingInput
                        field={field}
                        label="Option Value"
                      ></FloatingInput>
                    )}
                  />
                  {opt.optionValues?.length > 1 && (
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => removeProductOptionValue(optIdx, valIdx)}
                      className="absolute opacity-35 right-2 top-1 hover:bg-transparent"
                    >
                      <Trash2Icon />
                    </Button>
                  )}
                </div>
              ))}

              {/* Add another value */}
              {(opt.optionValues?.length ?? 0) < 4 && (
                <Button
                  onClick={() => addProductOptionValue(optIdx)}
                  className="p-0 -mt-3 self-start hover:bg-transparent"
                  variant="ghost"
                  type="button"
                >
                  <PlusCircle />
                  Add another value
                </Button>
              )}

              {/* Done Adding option values */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={() => {
                    setAddOptionBtnVisible(true);
                    removeProductOption(optIdx);
                  }}
                  variant="destructive"
                >
                  Delete
                </Button>
                <Button
                  onClick={async () => {
                    const isValid = await trigger("options");

                    if (!isValid) return;

                    setOptionAdded(optIdx, true);
                  }}
                  variant="outline"
                  type="button"
                >
                  Done
                </Button>
              </div>
            </CardContent>
          );
        }
      })}

      {/* Add option */}
      {addOptionBtnVisible && (options?.length ?? 0) < 3 && (
        <Button
          className="p-4 self-start hover:bg-transparent"
          onClick={addProductOption}
          type="button"
          variant="ghost"
        >
          <PlusCircle />
          Add option
        </Button>
      )}
    </Card>
  );
};

export default ProductOptions;
