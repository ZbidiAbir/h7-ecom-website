"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
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
import { Eye } from "lucide-react";
import ImageUpload from "@/components/image-upload";

interface Category {
  id: string;
  name: string;
  colors?: { id: string; color: string }[];
  sizes?: { id: string; size: string }[];
}

export default function CreateProductPage() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    categoryId: "",
    colors: [] as string[],
    sizes: [] as string[],
    inStock: true,
    stock: 0,
    images: [] as string[],
  });

  // Charger les catégories AVEC leurs couleurs et tailles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // AJOUT: Gestion des inputs texte
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Lorsqu'on sélectionne une catégorie
  const handleCategoryChange = (value: string) => {
    const category = categories.find((cat) => cat.id === value) || null;
    setSelectedCategory(category);
    setForm((prev) => ({
      ...prev,
      categoryId: value,
      colors: [],
      sizes: [],
    }));
  };

  // Gestion des couleurs (sélection multiple)
  const handleColorChange = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  // Gestion des tailles (sélection multiple)
  const handleSizeChange = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Gestion des images
  const handleAddImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));
  };

  const handleRemoveImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.categoryId) {
      alert("Veuillez remplir le nom, le prix et sélectionner une catégorie");
      return;
    }

    // Préparer les données pour l'API
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      discount: form.discount ? parseFloat(form.discount) : 0,
      categoryId: form.categoryId,
      colors: form.colors,
      sizes: form.sizes,
      inStock: form.inStock,
      stock: form.stock,
      images: form.images,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push("/admin/dashboard/prods");
      } else {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        alert(`Erreur: ${errorData.error || "Erreur lors de la création"}`);
      }
    } catch (error) {
      console.error("Erreur création produit:", error);
      alert("Erreur réseau lors de la création du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4">
      <main className="container mx-auto p-2">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Créer un produit</h1>
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            <Eye className="h-4 w-4 mr-2" />
            {preview ? "Modifier" : "Aperçu"}
          </Button>
        </div>

        <div
          className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}
        >
          {/* FORMULAIRE */}
          <Card>
            <CardHeader>
              <CardTitle>Détails du produit</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nom du produit..."
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description du produit..."
                    rows={4}
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={form.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {fetchLoading ? (
                        <SelectItem value="loading" disabled>
                          Chargement...
                        </SelectItem>
                      ) : categories.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Aucune catégorie
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prix & Réduction */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Ex: 49.99"
                      required
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
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>

                {/* Couleurs (Checkboxes) */}
                {selectedCategory?.colors &&
                  selectedCategory.colors.length > 0 && (
                    <div className="space-y-2">
                      <Label>Couleurs disponibles</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCategory.colors.map((colorObj) => (
                          <div
                            key={colorObj.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`color-${colorObj.id}`}
                              checked={form.colors.includes(colorObj.color)}
                              onChange={() => handleColorChange(colorObj.color)}
                              className="rounded border-gray-300"
                            />
                            <Label
                              htmlFor={`color-${colorObj.id}`}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: colorObj.color }}
                              />
                              {colorObj.color}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {form.colors.length > 0 && (
                        <p className="text-sm text-green-600">
                          {form.colors.length} couleur(s) sélectionnée(s)
                        </p>
                      )}
                    </div>
                  )}

                {/* Tailles (Checkboxes) */}
                {selectedCategory?.sizes &&
                  selectedCategory.sizes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Tailles disponibles</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedCategory.sizes.map((sizeObj) => (
                          <div
                            key={sizeObj.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`size-${sizeObj.id}`}
                              checked={form.sizes.includes(sizeObj.size)}
                              onChange={() => handleSizeChange(sizeObj.size)}
                              className="rounded border-gray-300"
                            />
                            <Label
                              htmlFor={`size-${sizeObj.id}`}
                              className="cursor-pointer"
                            >
                              {sizeObj.size}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {form.sizes.length > 0 && (
                        <p className="text-sm text-green-600">
                          {form.sizes.length} taille(s) sélectionnée(s)
                        </p>
                      )}
                    </div>
                  )}

                {/* Stock */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={form.inStock}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, inStock: checked }))
                      }
                    />
                    <Label htmlFor="inStock">Disponible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
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
                      placeholder="Quantité"
                      className="w-32"
                    />
                  </div>
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
                  {loading ? "Création..." : "Créer le produit"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* APERÇU */}
          {preview && (
            <Card>
              <CardHeader>
                <CardTitle>Aperçu</CardTitle>
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
                            {parseFloat(form.price || "0").toFixed(2)} €
                          </span>
                          <span className="text-red-600">
                            {(
                              parseFloat(form.price || "0") *
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
                    <strong>Catégorie:</strong>{" "}
                    {selectedCategory?.name || "N/A"}
                  </p>

                  {/* Affichage des couleurs sélectionnées */}
                  <div>
                    <strong>Couleurs:</strong>
                    {form.colors.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.colors.map((color, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded-full border"
                              style={{ backgroundColor: color }}
                            />
                            <span>{color}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground ml-2">Aucune</span>
                    )}
                  </div>

                  {/* Affichage des tailles sélectionnées */}
                  <div>
                    <strong>Tailles:</strong>
                    {form.sizes.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {form.sizes.map((size, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground ml-2">Aucune</span>
                    )}
                  </div>

                  <p>
                    <strong>Stock:</strong> {form.stock} unités •{" "}
                    <span
                      className={
                        form.inStock ? "text-green-600" : "text-red-600"
                      }
                    >
                      {form.inStock ? "Disponible" : "Rupture"}
                    </span>
                  </p>

                  {form.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {form.images.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt={`Image ${i + 1}`}
                          className="rounded-lg border object-cover w-full h-40"
                        />
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
