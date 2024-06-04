import { sendDataToDb } from "../../content/index";
import { useProducts } from "../../hooks/useProducts";
import { columns } from "./demo/columns";
import { DataTable } from "./demo/data-table";

export const Product = () => {
  const products = useProducts();
  const sendDataDb = () => {
    sendDataToDb();
  }
  return (
    <div className="w-[400px] p-4 gap-2">
      <DataTable columns={columns} data={products}/>
      <button onClick={sendDataDb} className="w-full outline outline-1 text-emerald-400 rounded-md mt-2 p-2 hover:bg-gray-200 font-semibold">Send Data</button>
    </div>
  );
};
