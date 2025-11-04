"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount: number;
  inStock: boolean;
  createdAt: string;
  author: { name?: string; image?: string };
  images: { url: string }[];
  colors: { color: string }[];
  sizes: { size: string }[];
};

export default function ProductsTable() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setData(res.data);
      } catch (error) {
        console.error("Erreur fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "price",
      header: "Prix",
      cell: (info) => `$${info.getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: "discount",
      header: "Remise",
      cell: (info) => `${info.getValue<number>()}%`,
    },
    {
      accessorKey: "inStock",
      header: "En stock",
      cell: (info) => (info.getValue<boolean>() ? "✅" : "❌"),
    },
    {
      accessorKey: "author.name",
      header: "Auteur",
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: (info) =>
        info
          .getValue<{ url: string }[]>()
          .map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt="product"
              className="h-10 w-10 object-cover inline-block mr-2"
            />
          )),
    },
    {
      accessorKey: "colors",
      header: "Couleurs",
      cell: (info) =>
        info.getValue<{ color: string }[]>().map((c, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 mr-1 rounded"
            style={{ backgroundColor: c.color, color: "#fff" }}
          >
            {c.color}
          </span>
        )),
    },
    {
      accessorKey: "sizes",
      header: "Tailles",
      cell: (info) =>
        info.getValue<{ size: string }[]>().map((s, idx) => (
          <span
            key={idx}
            className="inline-block px-2 py-1 mr-1 border rounded"
          >
            {s.size}
          </span>
        )),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border-b">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
