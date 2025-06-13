"use client";

import React from "react";
import TableLayout from "@/src/components/table/TableLayout";
import { DataTable } from "@/src/components/table/DataTable";
import { useOrderTable } from "@/src/features/orders/hooks/useOrderTable";

const Page = () => {
  const { tableConfig } = useOrderTable();

  return (
    <TableLayout heading="orders">
      <DataTable config={tableConfig} />
    </TableLayout>
  );
};

export default Page;
