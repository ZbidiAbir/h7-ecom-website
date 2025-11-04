"use client";

import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
} from "@react-pdf/renderer";
import {
  Download,
  Eye,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  User,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  dueDate: string | null;
  createdAt: string;
  order: {
    id: string;
    status: string;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingZip: string;
    shippingCountry: string;
    paymentMethod: string;
    user: {
      name: string | null;
      email: string | null;
      address?: string | null;
      phone?: string | null;
    };
    items: {
      id: string;
      image: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        description?: string;
        images: { id: string; url: string }[];
      };
    }[];
  };
}

// Enhanced PDF Styles
const pdfStyles = {
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#333",
  },
  headerSection: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 25,
    borderBottom: "1pt solid #e5e7eb",
    paddingBottom: 20,
  },
  logoContainer: {
    width: "30%",
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerInfo: {
    width: "70%",
    alignItems: "flex-end" as const,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#1f2937",
    marginBottom: 5,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#3b82f6",
  },
  twoColumns: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 15,
  },
  column: {
    width: "48%",
  },
  infoCard: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 5,
    border: "1pt solid #e5e7eb",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#374151",
    marginBottom: 8,
  },
  companyInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "#4b5563",
  },
  clientName: {
    fontSize: 11,
    fontWeight: "bold" as const,
    marginBottom: 4,
    color: "#1f2937",
  },
  clientInfo: {
    fontSize: 9,
    marginBottom: 3,
    color: "#4b5563",
  },
  detailCard: {
    padding: 12,
  },
  detailLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    fontWeight: "bold" as const,
    color: "#374151",
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: "flex-start" as const,
  },
  statusText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold" as const,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#374151",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1pt solid #e5e7eb",
  },
  table: {
    border: "1pt solid #e5e7eb",
    borderRadius: 5,
    overflow: "hidden" as const,
  },
  tableHeader: {
    flexDirection: "row" as const,
    backgroundColor: "#3b82f6",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderCell: {
    color: "white",
    fontWeight: "bold" as const,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row" as const,
    paddingVertical: 8,
    paddingHorizontal: 5,
    alignItems: "center" as const,
    minHeight: 50,
  },
  tableCell: {
    fontSize: 9,
    paddingHorizontal: 4,
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 3,
  },
  imagePlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: "#d1d5db",
    borderRadius: 3,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  placeholderText: {
    fontSize: 6,
    color: "#6b7280",
    fontWeight: "bold" as const,
  },
  productName: {
    fontWeight: "bold" as const,
    fontSize: 9,
    marginBottom: 2,
  },
  productDescription: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.2,
  },
  totalSection: {
    marginTop: 20,
    alignItems: "flex-end" as const,
  },
  totalContainer: {
    width: "40%",
    border: "1pt solid #e5e7eb",
    borderRadius: 5,
    padding: 15,
  },
  totalLine: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold" as const,
  },
  grandTotal: {
    borderTop: "1pt solid #e5e7eb",
    paddingTop: 8,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#1f2937",
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#3b82f6",
  },
  paymentSection: {
    marginTop: 25,
    paddingTop: 15,
    borderTop: "1pt solid #e5e7eb",
  },
  paymentInfo: {
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 5,
    border: "1pt solid #bae6fd",
  },
  paymentText: {
    fontSize: 9,
    color: "#0369a1",
    marginBottom: 3,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1pt solid #e5e7eb",
  },
  footerText: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center" as const,
    marginBottom: 5,
  },
  footerNote: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center" as const,
  },
};

// The Invoice Preview component
function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const subtotal = invoice.order.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = invoice.total - subtotal;

  return (
    <PDFViewer style={{ width: "100%", height: "100%" }}>
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          {/* Header with logo and company info */}
          <View style={pdfStyles.headerSection}>
            <View style={pdfStyles.logoContainer}>
              <View style={pdfStyles.logo}>
                <PDFImage src="/logo.png" />
              </View>
            </View>
            <View style={pdfStyles.headerInfo}>
              <Text style={pdfStyles.companyName}>HASHSEVEN</Text>
              <Text style={pdfStyles.invoiceTitle}>
                INVOICE #{invoice.invoiceNumber}
              </Text>
            </View>
          </View>

          {/* Company & client info */}
          <View style={pdfStyles.twoColumns}>
            <View style={pdfStyles.column}>
              <Text style={pdfStyles.sectionSubtitle}>SENDER</Text>
              <View style={pdfStyles.infoCard}>
                <Text style={pdfStyles.companyInfo}>HASHSEVEN</Text>
                <Text style={pdfStyles.companyInfo}>123 Commerce Street</Text>
                <Text style={pdfStyles.companyInfo}>75001 Paris, France</Text>
                <Text style={pdfStyles.companyInfo}>contact@company.com</Text>
                <Text style={pdfStyles.companyInfo}>+33 1 23 45 67 89</Text>
                <Text style={pdfStyles.companyInfo}>
                  SIRET: 123 456 789 00012
                </Text>
              </View>
            </View>

            <View style={pdfStyles.column}>
              <Text style={pdfStyles.sectionSubtitle}>CLIENT</Text>
              <View style={pdfStyles.infoCard}>
                <Text style={pdfStyles.clientName}>
                  {invoice.order.user.name || "Not specified"}
                </Text>
                <Text style={pdfStyles.clientInfo}>
                  {invoice.order.user.email}
                </Text>
                <Text style={pdfStyles.clientInfo}>
                  {invoice.order.shippingAddress}
                </Text>
                <Text style={pdfStyles.clientInfo}>
                  {invoice.order.shippingCity}
                </Text>
                <Text style={pdfStyles.clientInfo}>
                  {invoice.order.shippingCountry}
                </Text>
                {invoice.order.user.phone && (
                  <Text style={pdfStyles.clientInfo}>
                    {invoice.order.user.phone}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Invoice details */}
          <View style={[pdfStyles.twoColumns, { marginTop: 15 }]}>
            <View style={pdfStyles.column}>
              <View style={pdfStyles.detailCard}>
                <Text style={pdfStyles.detailLabel}>Created On:</Text>
                <Text style={pdfStyles.detailValue}>
                  {new Date(invoice.createdAt).toLocaleDateString("en-US")}
                </Text>

                <Text style={pdfStyles.detailLabel}>Due Date:</Text>
                <Text style={pdfStyles.detailValue}>
                  {invoice.dueDate
                    ? new Date(invoice.dueDate).toLocaleDateString("en-US")
                    : "30 days"}
                </Text>
              </View>
            </View>

            <View style={pdfStyles.column}>
              <View style={pdfStyles.detailCard}>
                <Text style={pdfStyles.detailLabel}>Status:</Text>
                <View
                  style={[
                    pdfStyles.statusBadge,
                    {
                      backgroundColor:
                        invoice.status === "PAID"
                          ? "#10b981"
                          : invoice.status === "UNPAID"
                          ? "#ef4444"
                          : "#6b7280",
                    },
                  ]}
                >
                  <Text style={pdfStyles.statusText}>
                    {invoice.status === "PAID"
                      ? "PAID"
                      : invoice.status === "UNPAID"
                      ? "UNPAID"
                      : "PENDING"}
                  </Text>
                </View>

                <Text style={pdfStyles.detailLabel}>Order Reference:</Text>
                <Text style={pdfStyles.detailValue}>
                  ORD-{invoice.order.id.slice(0, 8)}
                </Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>ITEMS</Text>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.tableHeader}>
                <Text style={[pdfStyles.tableHeaderCell, { width: "15%" }]}>
                  Product ID
                </Text>
                <Text style={[pdfStyles.tableHeaderCell, { width: "35%" }]}>
                  Description
                </Text>
                <Text
                  style={[
                    pdfStyles.tableHeaderCell,
                    { width: "10%", textAlign: "center" as const },
                  ]}
                >
                  Qty
                </Text>
                <Text
                  style={[
                    pdfStyles.tableHeaderCell,
                    { width: "15%", textAlign: "right" as const },
                  ]}
                >
                  Unit Price
                </Text>
                <Text
                  style={[
                    pdfStyles.tableHeaderCell,
                    { width: "15%", textAlign: "right" as const },
                  ]}
                >
                  Total
                </Text>
              </View>

              {invoice.order.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    pdfStyles.tableRow,
                    { backgroundColor: index % 2 === 0 ? "#f8fafc" : "white" },
                  ]}
                >
                  <Text style={[pdfStyles.tableCell, { width: "15%" }]}>
                    #{item.product.id.slice(0, 8)}
                  </Text>

                  <View style={[pdfStyles.tableCell, { width: "35%" }]}>
                    <Text style={pdfStyles.productName}>
                      {item.product.name}
                    </Text>
                    {item.product.description && (
                      <Text style={pdfStyles.productDescription}>
                        {item.product.description}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      pdfStyles.tableCell,
                      { width: "10%", textAlign: "center" as const },
                    ]}
                  >
                    {item.quantity}
                  </Text>

                  <Text
                    style={[
                      pdfStyles.tableCell,
                      { width: "15%", textAlign: "right" as const },
                    ]}
                  >
                    {item.product.price.toFixed(3)} DT
                  </Text>

                  <Text
                    style={[
                      pdfStyles.tableCell,
                      { width: "15%", textAlign: "right" as const },
                    ]}
                  >
                    {(item.product.price * item.quantity).toFixed(3)} DT
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Totals */}
          <View style={pdfStyles.totalSection}>
            <View style={pdfStyles.totalContainer}>
              <View style={pdfStyles.totalLine}>
                <Text style={pdfStyles.totalLabel}>Subtotal:</Text>
                <Text style={pdfStyles.totalValue}>
                  {subtotal.toFixed(3)} DT
                </Text>
              </View>
              {tax > 0 && (
                <View style={pdfStyles.totalLine}>
                  <Text style={pdfStyles.totalLabel}>VAT (30%):</Text>
                  <Text style={pdfStyles.totalValue}>{tax.toFixed(3)} DT</Text>
                </View>
              )}
              <View style={[pdfStyles.totalLine, pdfStyles.grandTotal]}>
                <Text style={pdfStyles.grandTotalLabel}>TOTAL:</Text>
                <Text style={pdfStyles.grandTotalValue}>
                  {invoice.total.toFixed(3)} DT
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Terms */}
          <View style={pdfStyles.paymentSection}>
            <Text style={pdfStyles.sectionTitle}>PAYMENT TERMS</Text>
            <View style={pdfStyles.paymentInfo}>
              <Text style={pdfStyles.paymentText}>
                Payment due within 30 days
              </Text>
              <Text style={pdfStyles.paymentText}>
                IBAN: FR76 3000 4000 0100 1234 5678 900
              </Text>
              <Text style={pdfStyles.paymentText}>BIC: BNPAFRPPXXX</Text>
              <Text style={pdfStyles.paymentText}>
                Payment Method: {invoice.order.paymentMethod}
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={pdfStyles.footer}>
            <Text style={pdfStyles.footerText}>
              Thank you for your trust! For any questions regarding this
              invoice, please contact our support at +33 1 23 45 67 89
            </Text>
            <Text style={pdfStyles.footerNote}>
              Invoice generated on {new Date().toLocaleDateString("en-US")}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

// Main Invoices Table Component
export default function InvoicesTable() {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50 border-green-200";
      case "UNPAID":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      header: "Invoice Number",
      accessorKey: "invoiceNumber",
      cell: ({ getValue }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="font-mono font-semibold text-gray-900">
            #{getValue() as string}
          </span>
        </div>
      ),
    },
    {
      header: "Client",
      accessorFn: (row) => row.order.user.name || row.order.user.email,
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.original.order.user.name || "Not specified"}
            </div>
            <div className="text-sm text-gray-500">
              {row.original.order.user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Items",
      accessorFn: (row) => row.order.items.length,
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ShoppingCart className="h-4 w-4" />
          <span>{row.original.order.items.length} item(s)</span>
        </div>
      ),
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (info) => (
        <span className="font-semibold text-gray-900">
          {(info.getValue() as number).toFixed(3)} DT
        </span>
      ),
    },
    {
      header: "Order Status",
      accessorFn: (row) => row.order.status,
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <Badge
            variant="outline"
            className={`${getStatusColor(value)} font-medium`}
          >
            {value}
          </Badge>
        );
      },
    },
    {
      header: "Invoice Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const value = getValue() as Invoice["status"];
        return (
          <Badge
            variant="outline"
            className={`${getStatusColor(value)} font-medium`}
          >
            {value}
          </Badge>
        );
      },
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: (info) => {
        const dueDate = info.getValue() as string | null;
        const isOverdue = dueDate && new Date(dueDate) < new Date();

        return (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span
              className={
                isOverdue ? "text-red-600 font-medium" : "text-gray-600"
              }
            >
              {dueDate ? new Date(dueDate).toLocaleDateString("en-US") : "-"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Created On",
      accessorKey: "createdAt",
      cell: (info) => (
        <div className="text-gray-600">
          {new Date(info.getValue() as string).toLocaleDateString("en-US")}
        </div>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => setPreviewInvoice(row.original)}
            variant="outline"
            className="h-8 px-3 text-xs"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/invoices")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
              <FileText className="h-6 w-6 text-blue-600" />
              <span>Invoices Management</span>
            </CardTitle>
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm font-semibold"
            >
              {data.length} invoice(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-50 to-blue-50/30">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-b hover:bg-transparent"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-gray-700 py-4 text-sm"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b hover:bg-blue-50/20 transition-colors duration-150 group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-6 border-t">
            <div className="text-sm text-gray-600 flex items-center space-x-2">
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <span className="text-gray-300">•</span>
              <span>{data.length} invoice(s) total</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[90vh] relative shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-t-xl">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Invoice Preview #{previewInvoice.invoiceNumber}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewInvoice(null)}
                  className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <InvoicePreview invoice={previewInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
