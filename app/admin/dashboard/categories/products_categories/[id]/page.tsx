"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Folder, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/image-upload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Product = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  images?: { id: string; url: string }[];
  sizes?: { id: string; size: string }[];
  colors?: { id: string; color: string }[];
};

type CategoryData = {
  category: {
    id: string;
    name: string;
    sizes?: { id: string; size: string }[];
    colors?: { id: string; color: string }[];
  } | null;
  products: Product[];
};

export default function ProductsByCategory() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Form state ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [discount, setDiscount] = useState("");
  const [inStock, setInStock] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Modal delete ---
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // --- Fetch products by category ---
  const fetchProductsByCategory = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`/api/categories/${id}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();
      setData({
        category: json.category || null,
        products: json.products || [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [id]);

  // --- Add product ---
  const handleAddProduct = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          description,
          stock: parseInt(stock),
          sizes: selectedSize ? [selectedSize] : [],
          colors: selectedColor ? [selectedColor] : [],
          images,
          discount: discount ? parseFloat(discount) : 0,
          inStock,
          categoryId: id,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setFormError(json.error || "Failed to create product");
        setSubmitting(false);
        return;
      }

      // Reset form
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setSelectedSize("");
      setSelectedColor("");
      setImages([]);
      setDiscount("");
      setInStock(true);
      setSubmitting(false);

      fetchProductsByCategory();
    } catch (err) {
      console.error(err);
      setFormError("Failed to create product");
      setSubmitting(false);
    }
  };

  // --- Delete product ---
  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const res = await fetch(`/api/products/${productToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setIsDeleteOpen(false);
      setProductToDelete(null);
      fetchProductsByCategory();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // --- Edit product ---
  const handleEditProduct = (productId: string) => {
    router.push(`/admin/dashboard/prods/${productId}`);
  };

  // --- Loading / Error UI ---
  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-64" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button variant="link" onClick={fetchProductsByCategory}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!data || !data.category) {
    return (
      <div className="text-center py-12">
        <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">Category not found</h3>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Products in {data.category.name}
          </h1>
          <p className="text-muted-foreground">
            {data.products.length} product(s)
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Sizes</TableHead>
              <TableHead>Colors</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data.products || []).map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {format(new Date(product.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex -space-x-2">
                      {(product.images || []).slice(0, 3).map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          alt={product.name}
                          className="h-6 w-6 rounded border-2 border-white object-cover"
                        />
                      ))}
                      {(product.images?.length || 0) > 3 && (
                        <div className="h-6 w-6 rounded bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                          +{(product.images?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {(product.sizes || []).length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {(product.sizes || []).map((s) => (
                        <Badge key={s.id} variant="outline" className="text-xs">
                          {s.size}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {(product.colors || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(product.colors || []).map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 bg-background border rounded-lg pl-2 pr-3 py-1 shadow-sm"
                        >
                          <div
                            className="w-5 h-5 rounded border shadow-sm"
                            style={{ backgroundColor: c.color }}
                            title={c.color}
                          />
                          <span className="text-xs font-mono max-w-[60px] truncate">
                            {c.color}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Form */}
      <div className="mt-12 p-6 border rounded-md bg-white shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">
          Add Product to {data.category.name}
        </h2>

        {formError && <Alert variant="destructive">{formError}</Alert>}

        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            placeholder="Stock"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Input
            placeholder="Discount (%)"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            In Stock
          </label>
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Select Size (radio) */}
          <div>
            <h3 className="font-medium">Select Size</h3>
            <div className="flex flex-wrap gap-3 mt-1">
              {(data.category.sizes || []).map((size) => (
                <label key={size.id} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="size"
                    value={size.size}
                    checked={selectedSize === size.size}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  />
                  {size.size}
                </label>
              ))}
            </div>
          </div>

          {/* Select Color (radio) avec aperçu visuel */}
          <div>
            <h3 className="font-medium">Select Color</h3>
            <div className="flex flex-wrap gap-3 mt-1">
              {(data.category.colors || []).map((color) => (
                <label
                  key={color.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="color"
                    value={color.color}
                    checked={selectedColor === color.color}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                      selectedColor === color.color
                        ? "border-primary ring-2 ring-primary ring-offset-1"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.color }}
                    title={color.color}
                  />
                  <span className="text-sm font-mono max-w-[80px] truncate">
                    {color.color}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <ImageUpload
            value={images}
            onChange={(url) => setImages([...images, url])}
            onRemove={(url) => setImages(images.filter((i) => i !== url))}
            disabled={loading}
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
