import React from "react";
import TableLayout from "@/src/components/TableLayout";
import OrderTable from "@/src/features/orders/components/table/OrdersTable";

const Page = () => {
  return (
    <TableLayout showButton={false} heading="orders">
      <OrderTable />
    </TableLayout>
  );
};

export default Page;
