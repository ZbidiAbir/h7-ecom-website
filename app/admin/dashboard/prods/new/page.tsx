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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Lorsqu’on sélectionne une catégorie
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

  // Gestion des images
  const handleAddImage = (url: string) =>
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));

  const handleRemoveImage = (url: string) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.categoryId) {
      alert("Veuillez remplir le nom, le prix et sélectionner une catégorie");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          discount: form.discount ? parseFloat(form.discount) : 0,
          categoryId: form.categoryId,
          color: form.color,
          size: form.size,
          inStock: form.inStock,
          stock: form.stock,
          images: form.images,
        }),
      });

      if (response.ok) router.push("/admin/dashboard/prods");
      else console.error(await response.json());
    } catch (error) {
      console.error("Erreur création produit:", error);
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
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="Ex: 10"
                    />
                  </div>
                </div>

                {/* Couleurs (Radio Buttons) */}
                {selectedCategory?.colors &&
                  selectedCategory.colors.length > 0 && (
                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <RadioGroup
                        value={form.color}
                        onValueChange={(val) =>
                          setForm((prev) => ({ ...prev, color: val }))
                        }
                        className="flex flex-wrap gap-3 mt-2"
                      >
                        {selectedCategory.colors.map((color) => (
                          <div
                            key={color.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem
                              value={color.color}
                              id={color.color}
                            />
                            <Label htmlFor={color.color}>{color.color}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                {/* Tailles (Radio Buttons) */}
                {selectedCategory?.sizes &&
                  selectedCategory.sizes.length > 0 && (
                    <div className="space-y-2">
                      <Label>Taille</Label>
                      <RadioGroup
                        value={form.size}
                        onValueChange={(val) =>
                          setForm((prev) => ({ ...prev, size: val }))
                        }
                        className="flex flex-wrap gap-3 mt-2"
                      >
                        {selectedCategory.sizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={size.size} id={size.size} />
                            <Label htmlFor={size.size}>{size.size}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                {/* Stock */}
                <div className="flex items-center space-x-4">
                  <Switch
                    id="inStock"
                    checked={form.inStock}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, inStock: checked }))
                    }
                  />
                  <Label htmlFor="inStock">Disponible</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Quantité en stock"
                  />
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
                  <p className="text-lg font-semibold">
                    Prix :{" "}
                    {form.discount
                      ? `${(
                          parseFloat(form.price) *
                          (1 - parseFloat(form.discount) / 100)
                        ).toFixed(2)} € (remisé)`
                      : `${form.price || "0"} €`}
                  </p>
                  <p>Couleur : {form.color || "N/A"}</p>
                  <p>Taille : {form.size || "N/A"}</p>
                  <p>
                    Stock : {form.stock} unités (
                    {form.inStock ? "Disponible" : "Rupture"})
                  </p>

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {form.images.map((url, i) => (
                        <img
                          key={`${url}-${i}`}
                          src={url}
                          alt={`Image ${i + 1}`}
                          className="rounded-lg border object-cover w-full h-40"
                        />
                      ))}
                    </div>
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
