import { useProducts } from "../../hooks/useProducts";
import { columns } from "./demo/columns";
import { DataTable } from "./demo/data-table";

export const Product = () => {
  const products = useProducts();
  return (
    <div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};
