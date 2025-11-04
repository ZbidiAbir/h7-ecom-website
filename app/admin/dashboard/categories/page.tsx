"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Folder,
  Calendar,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  Search,
  Filter,
  Image as ImageIcon,
  Package,
  Ruler,
  Palette,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  products: { id: string; name: string }[];
  images: { id: string; url: string }[];
  sizes: { id: string; size: string }[];
  colors: { id: string; color: string }[];
  parent?: {
    id: string;
    name: string;
  };
};

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      setError(null);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
  };

  const openDeleteModal = (category: Category) => {
    setDeletingCategory(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleEdit = async () => {
    if (!editingCategory || !categoryName.trim()) return;

    try {
      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory.id,
          name: categoryName.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update category");

      toast.success("Category updated successfully");
      fetchCategories();
      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error("Error updating category");
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingCategory.id }),
      });

      if (!res.ok) throw new Error("Failed to delete category");

      toast.success("Category deleted successfully");
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategory.id));
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting category");
    }
  };

  const StatBadge = ({
    icon: Icon,
    count,
    label,
  }: {
    icon: any;
    count: number;
    label: string;
  }) => (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <div className="font-semibold text-foreground">{count}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6 p-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your product categories
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">
              Manage your product categories
            </p>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
            onClick={fetchCategories}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6  p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories and organization
          </p>
        </div>
        <Link href="/admin/dashboard/categories/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {categories.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatBadge icon={Folder} count={categories.length} label="Total" />
          <StatBadge
            icon={Package}
            count={categories.reduce(
              (acc, cat) => acc + cat.products.length,
              0
            )}
            label="Products"
          />
          <StatBadge
            icon={ImageIcon}
            count={categories.reduce((acc, cat) => acc + cat.images.length, 0)}
            label="Images"
          />
          <StatBadge
            icon={Ruler}
            count={categories.reduce((acc, cat) => acc + cat.sizes.length, 0)}
            label="Sizes"
          />
          <StatBadge
            icon={Palette}
            count={categories.reduce((acc, cat) => acc + cat.colors.length, 0)}
            label="Colors"
          />
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Folder className="h-5 w-5" />
                Categories List
              </CardTitle>
              <CardDescription>
                {filteredCategories.length} of {categories.length} categories
              </CardDescription>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {searchTerm
                  ? "Try adjusting your search terms to find what you're looking for."
                  : "Get started by creating your first product category."}
              </p>
              {!searchTerm && (
                <Link href="/admin/dashboard/categories/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Category
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Category</TableHead>
                    <TableHead className="w-[300px]">Category Parent</TableHead>

                    <TableHead className="hidden lg:table-cell">
                      Dates
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Products
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Media
                    </TableHead>
                    <TableHead className="hidden 2xl:table-cell">
                      Attributes
                    </TableHead>
                    <TableHead className="text-right w-[80px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="group">
                      {/* Category Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Folder className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-foreground truncate">
                              {category.name}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>ID: {category.id.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {category.parent?.name}
                        </div>
                      </TableCell>
                      {/* Dates - Responsive */}
                      <TableCell className="hidden lg:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {format(
                              new Date(category.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Updated{" "}
                            {format(new Date(category.updatedAt), "MMM dd")}
                          </div>
                        </div>
                      </TableCell>

                      {/* Products */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <Badge
                            variant={
                              category.products.length > 0
                                ? "default"
                                : "secondary"
                            }
                          >
                            {category.products.length}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Images */}
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex -space-x-2">
                            {category.images.slice(0, 3).map((img) => (
                              <img
                                key={img.id}
                                src={img.url}
                                alt={category.name}
                                className="h-6 w-6 rounded border-2 border-background object-cover"
                              />
                            ))}
                            {category.images.length > 3 && (
                              <div className="h-6 w-6 rounded bg-muted border-2 border-background flex items-center justify-center text-xs">
                                +{category.images.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Attributes */}
                      <TableCell className="hidden 2xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {category.sizes.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {category.sizes.length} sizes
                            </Badge>
                          )}
                          {category.colors.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {category.colors.length} colors
                            </Badge>
                          )}
                          {category.sizes.length === 0 &&
                            category.colors.length === 0 && (
                              <span className="text-xs text-muted-foreground">
                                -
                              </span>
                            )}
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/dashboard/categories/${category.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/dashboard/categories/products_categories/${category.id}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Products{" "}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditModal(category)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Quick Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteModal(category)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category Name</DialogTitle>
            <DialogDescription>
              Update the category name. This will be reflected across all
              products.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                !categoryName.trim() || categoryName === editingCategory?.name
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              category and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Folder className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <div className="font-semibold">{deletingCategory?.name}</div>
              <div className="text-sm text-muted-foreground">
                {deletingCategory?.products.length || 0} products • Created{" "}
                {deletingCategory &&
                  format(new Date(deletingCategory.createdAt), "MMM dd, yyyy")}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
