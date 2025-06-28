import React from "react";
import { productService } from "@repo/shared";
import ProductForm from "@/src/features/products/components/ProductForm";
import { notFound } from "next/navigation";

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const { data: product } = await productService.getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product}></ProductForm>;
};

export default Page;
