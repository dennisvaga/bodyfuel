"use client";

import React from "react";
import TableLayout from "@/src/components/table/TableLayout";
import { DataTable } from "@/src/components/table/DataTable";
import { useCollectionTable } from "@/src/features/collections/hooks/useCollectionTable";

const Page = () => {
  const { tableConfig } = useCollectionTable();

  return (
    <TableLayout
      heading="collections"
      primaryAction={tableConfig.primaryAction}
    >
      <DataTable config={tableConfig} />
    </TableLayout>
  );
};

export default Page;
