"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image,
  Palette,
  Ruler,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount: number;
  inStock: boolean;
  stock: number;
  createdAt: string;
  category: { name: string };
  author: { name?: string; image?: string };
  images: { url: string }[];
  colors: { color: string }[];
  sizes: { size: string }[];
};

export default function ProductsTable() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(null);
        const res = await axios.get("/api/products");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    router.push(`/admin/dashboard/prods/${product.id}`);
  };

  const openDeleteModal = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`/api/products/${productToDelete.id}`);
      setData(data.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">
            {row.getValue("name")}
          </span>
          {row.original.description && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.original.description}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.original.category.name;
        return (
          <Badge
            variant={category ? "outline" : "secondary"}
            className="text-xs whitespace-nowrap"
          >
            {category ?? "Undefined"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "STOCK",
      cell: ({ row }) => {
        const stock = row.original.stock;
        return (
          <Badge
            variant={stock ? "outline" : "secondary"}
            className="text-xs whitespace-nowrap"
          >
            {stock ?? "Undefined"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue<number>("price");
        const discount = row.original.discount;
        const finalPrice = price * (1 - discount / 100);

        return (
          <div className="flex flex-col items-end">
            {discount > 0 ? (
              <>
                <span className="font-semibold text-foreground">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-foreground">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "discount",
      header: "Discount",
      cell: ({ row }) => {
        const discount = row.getValue<number>("discount");
        return (
          <div className="text-center">
            {discount > 0 ? (
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "inStock",
      header: "Availability",
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue<boolean>("inStock") ? (
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Out of Stock
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "images",
      header: () => (
        <div className="flex items-center gap-1">
          <Image className="h-4 w-4" />
          Images
        </div>
      ),
      cell: ({ row }) => {
        const images = row.getValue<{ url: string }[]>("images");
        return (
          <div className="flex -space-x-2">
            {images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt="product"
                className="h-8 w-8 rounded-lg object-cover border-2 border-background"
              />
            ))}
            {images.length > 3 && (
              <div className="h-8 w-8 rounded-lg bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  +{images.length - 3}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "colors",
      header: () => (
        <div className="flex items-center gap-1">
          <Palette className="h-4 w-4" />
          Colors
        </div>
      ),
      cell: ({ row }) => {
        const colors = row.getValue<{ color: string }[]>("colors");
        return (
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {colors.slice(0, 2).map((c, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {c.color}
              </Badge>
            ))}
            {colors.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{colors.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "sizes",
      header: () => (
        <div className="flex items-center gap-1">
          <Ruler className="h-4 w-4" />
          Sizes
        </div>
      ),
      cell: ({ row }) => {
        const sizes = row.getValue<{ size: string }[]>("sizes");
        return (
          <div className="flex flex-wrap gap-1 max-w-[120px]">
            {sizes.slice(0, 2).map((s, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {s.size}
              </Badge>
            ))}
            {sizes.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{sizes.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEdit(row.original)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => openDeleteModal(row.original)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
          </CardTitle>
          <CardDescription>Loading your products...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
            <Badge variant="secondary">{data.length}</Badge>
          </CardTitle>
          <CardDescription>
            Manage all your products and inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getPaginationRowModel().rows?.length ? (
                  table.getPaginationRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground font-medium">
                          No products found
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Products will appear here once created
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      <AlertDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.name}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
