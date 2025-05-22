import React from "react";
import TableLayout from "@/src/components/TableLayout";
import CollectionTable from "@/src/features/collections/components/table/CollectionTable";

const Page = () => {
  return (
    <TableLayout heading="collections">
      <CollectionTable />
    </TableLayout>
  );
};

export default Page;
