
import { Product } from "@/src/hooks/useProducts"
import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "ASIN",
    header: "Asin",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
//   {
//     accessorKey: "color",
//     header: "Color",
//   },
//   {
//     accessorKey: "manufacturer",
//     header: "manufacturer",
//   },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: 'Action',
    header: 'Delete',
    cell: () => {
      return <Trash2 className="text-rose-300"/>
    }
  }
  // {
  //   accessorKey: "productTitle",
  //   header: "Product Title",
  // },
//   {
//     accessorKey: "rating",
//     header: "Rating",
//   },
//   {
//     accessorKey: "reviewCount",
//     header: "Review Count",
//   },
//   {
//     accessorKey: "unitCount",
//     header: "Unit Count",
//   },
]
