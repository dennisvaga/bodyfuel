import React from "react";
import { collectionService } from "@repo/shared";
import CollectionForm from "@/src/features/collections/components/CollectionForm";

const Page = async (props: { params: Promise<{ slug: string }> }) => {
  const params = await props.params;
  const collection = await collectionService.getCollectionBySlug(params.slug);
  return <CollectionForm collection={collection.data}></CollectionForm>;
};

export default Page;
