"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, X, Plus } from "lucide-react";
import ImageUpload from "@/components/image-upload";

type Category = {
  id: string;
  name: string;
  sizes?: { id: string; size: string }[];
  colors?: { id: string; color: string }[];
};

type FormType = {
  name: string;
  category: Category;
  description: string;
  price: string;
  discount: string;
  stock: number;
  inStock: boolean;
  images: string[];
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState<FormType>({
    name: "",
    category: { id: "", name: "" },
    description: "",
    price: "",
    discount: "",
    inStock: true,
    stock: 0,
    images: [],
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
        const data = await res.json();

        setForm({
          name: data.name || "",
          category: data.category || { id: "", name: "" },
          description: data.description || "",
          price: data.price?.toString() || "",
          discount: data.discount?.toString() || "0",
          inStock: data.inStock ?? true,
          stock: data.stock ?? 0,
          images: data.images?.map((img: any) => img.url) || [],
        });

        setSelectedSize(data.sizes?.[0]?.size || "");
        setSelectedColor(data.colors?.[0]?.color || "");

        // Charger les couleurs personnalisées existantes
        if (data.colors && data.colors.length > 0) {
          const existingColors = data.colors.map((c: any) => c.color);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleAddImage = (url: string) =>
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));

  const handleRemoveImage = (url: string) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));

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
    if (!form.category.id.trim()) return setError("La catégorie est requise");

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
          categoryId: form.category.id,
          sizes: selectedSize ? [selectedSize] : [],
          colors: selectedColor ? [selectedColor] : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setForm((prev) => ({
        ...prev,
        ...data,
        category: data.category || prev.category,
        images: data.images?.map((img: any) => img.url) || prev.images,
      }));

      setError("");
      alert("Produit mis à jour avec succès !");
    } catch (err: any) {
      console.error("Erreur mise à jour produit:", err);
      setError(err.message || "Erreur lors de la mise à jour du produit");
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find((cat) => cat.id === form.category.id);
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
                  <select
                    id="category"
                    name="category"
                    value={form.category.id}
                    onChange={(e) => {
                      const selected = categories.find(
                        (cat) => cat.id === e.target.value
                      );
                      setForm((prev) => ({
                        ...prev,
                        category: selected || { id: "", name: "" },
                      }));
                      // Réinitialiser la sélection de couleur/taille
                      setSelectedColor("");
                      setSelectedSize("");
                    }}
                    className="w-full border rounded px-3 py-2"
                    required
                    disabled={loading}
                  >
                    <option value="">Sélectionner une catégorie...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
                    <RadioGroup
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      className="flex flex-wrap gap-4"
                    >
                      {currentCategory.sizes.map((size) => (
                        <div
                          key={size.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={size.size}
                            id={`size-${size.id}`}
                            disabled={loading}
                          />
                          <Label htmlFor={`size-${size.id}`}>{size.size}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Couleur avec Color Picker */}
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

                  {/* Color Picker compact */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Label className="text-sm font-medium text-gray-700 block mb-3">
                      Ajouter une couleur personnalisée
                    </Label>
                    <div className="flex gap-3 items-end">
                      <div className="flex-1 grid grid-cols-[1fr,auto] gap-2">
                        <div className="space-y-2">
                          <Input
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            placeholder="#FFFFFF"
                            className="font-mono text-sm"
                            disabled={loading}
                          />
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <div
                              className="w-3 h-3 rounded border"
                              style={{ backgroundColor: newColor }}
                            />
                            <span>Aperçu</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <input
                            type="color"
                            value={newColor}
                            onChange={(e) => setNewColor(e.target.value)}
                            className="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-colors"
                            disabled={loading}
                            title="Choisir une couleur"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddCustomColor}
                        disabled={loading || !newColor}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  {/* Sélection de couleur - Version optimisée */}
                  {allColors.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">
                        Choisir une couleur{" "}
                        {currentCategory?.colors?.length &&
                          `(${allColors.length} disponible${
                            allColors.length > 1 ? "s" : ""
                          })`}
                      </Label>

                      <RadioGroup
                        value={selectedColor}
                        onValueChange={setSelectedColor}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                      >
                        {/* Couleurs de la catégorie */}
                        {currentCategory?.colors?.map((color) => (
                          <div key={color.id} className="relative group">
                            <RadioGroupItem
                              value={color.color}
                              id={`color-${color.id}`}
                              disabled={loading}
                              className="sr-only" // Masqué visuellement mais accessible
                            />
                            <Label
                              htmlFor={`color-${color.id}`}
                              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedColor === color.color
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900 truncate block">
                                  {color.color}
                                </span>
                                {currentCategory?.colors && (
                                  <span className="text-xs text-gray-500">
                                    Catégorie
                                  </span>
                                )}
                              </div>
                              {selectedColor === color.color && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </Label>
                          </div>
                        ))}

                        {/* Couleurs personnalisées */}
                        {customColors.map((color, index) => (
                          <div
                            key={`custom-${index}`}
                            className="relative group"
                          >
                            <RadioGroupItem
                              value={color}
                              id={`custom-color-${index}`}
                              disabled={loading}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={`custom-color-${index}`}
                              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedColor === color
                    ? "border-blue-500 bg-blue-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                }
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
                            >
                              <div
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-gray-900 truncate block">
                                  {color}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Personnalisée
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {selectedColor === color && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
                                )}
                                <X
                                  className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveCustomColor(color);
                                  }}
                                />
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {/* État vide */}
                  {allColors.length === 0 && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Aucune couleur disponible. Ajoutez une couleur
                        personnalisée.
                      </p>
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
                    <strong>Catégorie:</strong> {form.category.name || "N/A"}
                  </p>

                  {/* Aperçu de la couleur avec visuel */}
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
