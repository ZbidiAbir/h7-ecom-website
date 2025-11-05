"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, X, Plus } from "lucide-react";
import ImageUpload from "@/components/image-upload";

type Category = {
  id: string;
  name: string;
  sizes?: { id: string; size: string }[];
  colors?: { id: string; color: string }[];
};

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  inStock: boolean;
  stock: number;
  images: { url: string }[];
  category: Category;
  colors: { color: string }[];
  sizes: { size: string }[];
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    inStock: true,
    stock: 0,
    images: [] as string[],
    categoryId: "",
  });

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [newColor, setNewColor] = useState<string>("#000000");

  // Charger le produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Produit non trouvé");
        const data: ProductData = await res.json();

        setForm({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          discount: data.discount?.toString() || "0",
          inStock: data.inStock ?? true,
          stock: data.stock ?? 0,
          images: data.images?.map((img) => img.url) || [],
          categoryId: data.category?.id || "",
        });

        setSelectedSize(data.sizes?.[0]?.size || "");
        setSelectedColor(data.colors?.[0]?.color || "");

        // Charger les couleurs personnalisées existantes
        if (data.colors && data.colors.length > 0) {
          const existingColors = data.colors.map((c) => c.color);
          setCustomColors(existingColors);
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Erreur de chargement");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur chargement catégories:", err);
        setError("Erreur lors du chargement des catégories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAddImage = (url: string) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const handleRemoveImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  // Gestion des couleurs personnalisées
  const handleAddCustomColor = () => {
    if (newColor && !customColors.includes(newColor)) {
      setCustomColors((prev) => [...prev, newColor]);
      setSelectedColor(newColor);
      setNewColor("#000000");
    }
  };

  const handleRemoveCustomColor = (color: string) => {
    setCustomColors((prev) => prev.filter((c) => c !== color));
    if (selectedColor === color) {
      setSelectedColor("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) return setError("Le nom du produit est requis");
    if (!form.price.trim() || isNaN(parseFloat(form.price)))
      return setError("Le prix est invalide");
    if (!form.categoryId) return setError("La catégorie est requise");

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: parseFloat(form.price),
          discount: form.discount ? parseFloat(form.discount) : 0,
          inStock: form.inStock,
          stock: parseInt(form.stock.toString()),
          images: form.images,
          categoryId: form.categoryId,
          sizes: selectedSize ? [selectedSize] : [],
          colors: selectedColor ? [selectedColor] : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      alert("Produit mis à jour avec succès !");
      router.push("/admin/dashboard/prods");
    } catch (err: any) {
      console.error("Erreur mise à jour produit:", err);
      setError(err.message || "Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find((cat) => cat.id === form.categoryId);
  const allColors = [
    ...(currentCategory?.colors?.map((c) => c.color) || []),
    ...customColors,
  ];

  if (loading && !form.name) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <main className="container mx-auto p-2">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Modifier le produit</h1>
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="h-4 w-4 mr-2" />
            {preview ? "Modifier" : "Aperçu"}
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div
          className={`grid grid-cols-1 ${
            preview ? "lg:grid-cols-2 gap-8" : ""
          }`}
        >
          {/* Formulaire */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={(value) => {
                      setForm((prev) => ({ ...prev, categoryId: value }));
                      setSelectedColor("");
                      setSelectedSize("");
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    disabled={loading}
                  />
                </div>

                {/* Prix & Réduction */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">Réduction (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={form.discount}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="inStock"
                      checked={form.inStock}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, inStock: checked }))
                      }
                      disabled={loading}
                    />
                    <Label htmlFor="inStock">Disponible</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="stock">Quantité:</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          stock: parseInt(e.target.value) || 0,
                        }))
                      }
                      disabled={loading}
                      className="w-32"
                    />
                  </div>
                </div>

                {/* Taille */}
                {currentCategory?.sizes && currentCategory.sizes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Taille</Label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCategory.sizes.map((size) => (
                          <SelectItem key={size.id} value={size.size}>
                            {size.size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Couleur */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Couleur</Label>
                    {selectedColor && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-sm font-medium text-blue-700">
                          Sélectionnée
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sélection de couleur */}
                  {allColors.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Choisir une couleur
                      </Label>
                      <Select
                        value={selectedColor}
                        onValueChange={setSelectedColor}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Couleurs de la catégorie */}
                          {currentCategory?.colors?.map((color) => (
                            <SelectItem key={color.id} value={color.color}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color.color }}
                                />
                                {color.color}
                              </div>
                            </SelectItem>
                          ))}

                          {/* Couleurs personnalisées */}
                          {customColors.map((color, index) => (
                            <SelectItem key={`custom-${index}`} value={color}>
                              <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color }}
                                  />
                                  {color}
                                </div>
                                <X
                                  className="h-3 w-3 text-gray-400 hover:text-red-500 transition-colors"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveCustomColor(color);
                                  }}
                                />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label>Images du produit</Label>
                  <ImageUpload
                    value={form.images}
                    onChange={handleAddImage}
                    onRemove={handleRemoveImage}
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500">
                    {form.images.length} image(s) sélectionnée(s)
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Mise à jour..." : "Mettre à jour le produit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Aperçu */}
          {preview && (
            <Card>
              <CardHeader>
                <CardTitle>Aperçu du produit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">
                    {form.name || "Nom du produit"}
                  </h2>
                  <p className="text-muted-foreground">
                    {form.description || "Aucune description."}
                  </p>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      {form.discount && parseFloat(form.discount) > 0 ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">
                            {parseFloat(form.price).toFixed(2)} €
                          </span>
                          <span className="text-red-600">
                            {(
                              parseFloat(form.price) *
                              (1 - parseFloat(form.discount) / 100)
                            ).toFixed(2)}{" "}
                            €
                          </span>
                          <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                            -{form.discount}%
                          </span>
                        </>
                      ) : (
                        `${form.price || "0"} €`
                      )}
                    </p>
                  </div>
                  <p>
                    <strong>Catégorie:</strong> {currentCategory?.name || "N/A"}
                  </p>

                  <div className="flex items-center gap-2">
                    <strong>Couleur:</strong>
                    {selectedColor ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span>{selectedColor}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>

                  <p>
                    <strong>Taille:</strong> {selectedSize || "N/A"}
                  </p>
                  <p>
                    <strong>Stock:</strong> {form.stock} unités •
                    <span
                      className={
                        form.inStock
                          ? "text-green-600 ml-1"
                          : "text-red-600 ml-1"
                      }
                    >
                      {form.inStock ? "Disponible" : "Rupture de stock"}
                    </span>
                  </p>

                  {form.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {form.images.map((url, i) => (
                        <div key={i} className="relative">
                          <img
                            src={url}
                            alt={`Image ${i + 1}`}
                            className="rounded-lg border object-cover w-full h-40"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Aucune image</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
