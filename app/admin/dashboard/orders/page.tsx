"use client";

import { useEffect, useState } from "react";
import { GiConfirmed } from "react-icons/gi";

import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
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
  Package,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowUpDown,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Mail,
  Download,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type OrderItem = {
  id: string;
  product: {
    id: string;
    name: string;
    description?: string;
  };
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  phoneNumber: string;
  additionalInfo: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingName?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingCountry?: string;
  paymentMethod?: string;
  notes?: string;
};

export default function OrdersTable() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await axios.get("/api/orders");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      setData((prevData) =>
        prevData.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update order status");
    }
  };

  const exportOrder = (order: Order) => {
    const orderData = `
Order #${order.id}
Customer: ${order.user.name} (${order.user.email})
Date: ${new Date(order.createdAt).toLocaleDateString()}
Status: ${order.status}
Total: ${order.total.toFixed(3)}DT

Items:
${order.items
  .map(
    (item) =>
      `- ${item.product.name} x${item.quantity}: $${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}

Shipping Address:
${order.shippingName}
${order.shippingAddress}
${order.shippingCity} ${order.shippingZip}
${order.shippingCountry}
`;

    const blob = new Blob([orderData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadInvoice = (order: Order) => {
    const invoiceContent = `
Invoice for Order #${order.id}
Customer: ${order.user.name} (${order.user.email})
Date: ${new Date(order.createdAt).toLocaleDateString()}
-------------------------------------------
Items:
${order.items
  .map(
    (item) =>
      `${item.product.name} x${item.quantity} - $${(
        item.price * item.quantity
      ).toFixed(2)}`
  )
  .join("\n")}
-------------------------------------------
Total: ${order.total.toFixed(3)}DT
Payment Method: ${order.paymentMethod || "Not specified"}
Shipping Address:
${order.shippingName || ""}
${order.shippingAddress || ""}
${order.shippingCity || ""} ${order.shippingZip || ""}
${order.shippingCountry || ""}
-------------------------------------------
Thank you for your order!
`;

    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          #{row.original.id.slice(0, 8)}...
        </div>
      ),
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-sm text-muted-foreground">
            {row.original.user.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ row }) => (
        <div className="space-y-1">
          {row.original.phoneNumber && (
            <div className="text-xs text-muted-foreground">
              {row.original.phoneNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue<number>("total").toFixed(3)}DT
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<string>("status");
        const statusConfig = {
          PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
          CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
          PAID: { label: "Paid", color: "bg-blue-100 text-blue-800" },
          COMPLETED: {
            label: "Completed",
            color: "bg-green-100 text-green-800",
          },
          CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
          SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
          PROCESSING: {
            label: "Processing",
            color: "bg-orange-100 text-orange-800",
          },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || {
          label: status,
          color: "bg-gray-100 text-gray-800",
        };
        return (
          <Badge className={`text-xs ${config.color}`}>{config.label}</Badge>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
      cell: ({ row }) => (
        <div className="text-sm capitalize">
          {row.original.paymentMethod || "Not specified"}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue<string>("createdAt"));
        return (
          <div className="space-y-1">
            <div className="text-sm">{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 max-w-[250px]">
          {row.original.items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="truncate flex-1 mr-2">
                {item.product.name} x{item.quantity}
              </span>
              <span className="font-medium whitespace-nowrap">
                {(item.price * item.quantity).toFixed(3)}DT
              </span>
            </div>
          ))}
          {row.original.items.length > 3 && (
            <div className="text-xs text-muted-foreground mt-1">
              +{row.original.items.length - 3} more item(s)
            </div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            {/* View Details */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Order Details #{order.id}</DialogTitle>
                  <DialogDescription>
                    Complete information about the order
                  </DialogDescription>
                </DialogHeader>
                <OrderDetails order={order} />
              </DialogContent>
            </Dialog>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => exportOrder(order)}>
                  <Download className="h-4 w-4 mr-2" /> Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadInvoice(order)}>
                  <FileText className="h-4 w-4 mr-2" /> Download Invoice
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" /> Send Email
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(order.id, "PROCESSING")}
                >
                  <GiConfirmed className="h-4 w-4 mr-2" /> Processing
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(order.id, "CONFIRMED")}
                >
                  <Edit className="h-4 w-4 mr-2" /> Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(order.id, "SHIPPED")}
                >
                  <Truck className="h-4 w-4 mr-2" /> Shipped
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateOrderStatus(order.id, "CANCELLED")}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const OrderDetails = ({ order }: { order: Order }) => (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Name
              </label>
              <p className="font-medium">{order.user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <p className="font-medium">{order.user.email}</p>
            </div>
            {order.phoneNumber && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p className="font-medium">{order.phoneNumber}</p>
              </div>
            )}
            {order.additionalInfo && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Additional Information
                </label>
                <p className="font-medium">{order.additionalInfo}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div className="font-medium">{item.product.name}</div>
              <div className="flex gap-4">
                <span>Qty: {item.quantity}</span>
                <span>Price: {(item.price * item.quantity).toFixed(3)}DT</span>
              </div>
            </div>
          ))}
          <div className="text-right font-bold mt-2">
            Total: {order.total.toFixed(3)}DT
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="font-medium">{order.shippingName || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Address
            </label>
            <p className="font-medium">{order.shippingAddress || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              City / ZIP
            </label>
            <p className="font-medium">
              {order.shippingCity || "N/A"} {order.shippingZip || ""}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Country
            </label>
            <p className="font-medium">{order.shippingCountry || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Method
            </label>
            <p className="font-medium">{order.paymentMethod || "N/A"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Status
            </label>
            <p className="font-medium">{order.status}</p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" /> Orders
          </CardTitle>
          <CardDescription>Loading orders...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> Orders
          <Badge variant="secondary">{data.length}</Badge>
        </CardTitle>
        <CardDescription>
          Manage all orders placed by your customers
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 transition-colors"
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
                        No orders found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Orders will appear here once placed
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
            Showing {table.getRowModel().rows.length} of {data.length} order(s)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: table.getPageCount() }, (_, i) => (
                <Button
                  key={i}
                  variant={pagination.pageIndex === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => table.setPageIndex(i)}
                  className="h-8 w-8 p-0"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
