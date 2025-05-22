import TableLayout from "@/src/components/TableLayout";
import ProductTable from "@/src/features/products/components/table/ProductTable";

const Dashboard = async () => {
  return (
    <TableLayout heading="products">
      <ProductTable />
    </TableLayout>
  );
};

export default Dashboard;
