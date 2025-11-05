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

interface CategoryColor {
  id: string;
  color: string;
}

interface CategorySize {
  id: string;
  size: string;
}

interface Category {
  id: string;
  name: string;
  colors?: CategoryColor[];
  sizes?: CategorySize[];
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
    color: "",
    size: "",
    inStock: true,
    stock: 0,
    images: [] as string[],
  });

  // Charger les catégories
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

  // Lorsqu'on sélectionne une catégorie
  const handleCategoryChange = (value: string) => {
    const category = categories.find((cat) => cat.id === value) || null;
    setSelectedCategory(category);
    setForm((prev) => ({
      ...prev,
      categoryId: value,
      color: "",
      size: "",
    }));
  };

  // Gestion des inputs texte
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // CORRECTION : Gestion des images
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
      colors: form.color ? [form.color] : [],
      sizes: form.size ? [form.size] : [],
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

                {/* CORRECTION : Couleurs (Select) */}
                {selectedCategory?.colors &&
                  selectedCategory.colors.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="color">Couleur</Label>
                      <Select
                        value={form.color}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, color: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une couleur" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.colors.map((color) => (
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
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                {/* CORRECTION : Tailles (Select) */}
                {selectedCategory?.sizes &&
                  selectedCategory.sizes.length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="size">Taille</Label>
                      <Select
                        value={form.size}
                        onValueChange={(value) =>
                          setForm((prev) => ({ ...prev, size: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedCategory.sizes.map((size) => (
                            <SelectItem key={size.id} value={size.size}>
                              {size.size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                  <div className="flex items-center gap-2">
                    <strong>Couleur:</strong>
                    {form.color ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: form.color }}
                        />
                        <span>{form.color}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>

                  <p>
                    <strong>Taille:</strong> {form.size || "N/A"}
                  </p>

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
