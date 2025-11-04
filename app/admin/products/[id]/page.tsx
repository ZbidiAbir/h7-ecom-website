"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Eye, X } from "lucide-react";
import ImageUpload from "@/components/image-upload";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    colors: [] as string[],
    sizes: [] as string[],
    newColor: "",
    newSize: "",
    inStock: true,
    images: [] as string[],
  });

  // ✅ Charger le produit existant
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Produit non trouvé");
        const data = await res.json();

        setForm({
          name: data.name,
          description: data.description || "",
          price: data.price.toString(),
          discount: data.discount?.toString() || "",
          colors: data.colors.map((c: any) => c.color),
          sizes: data.sizes.map((s: any) => s.size),
          newColor: "",
          newSize: "",
          inStock: data.inStock,
          images: data.images.map((img: any) => img.url),
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);

  // ✅ Gérer le formulaire (identique à la création)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = (url: string) =>
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
  const handleRemoveImage = (url: string) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));

  const handleAddColor = () => {
    const color = form.newColor.trim();
    if (color && !form.colors.includes(color)) {
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
        newColor: "",
      }));
    }
  };

  const handleAddSize = () => {
    const size = form.newSize.trim();
    if (size && !form.sizes.includes(size)) {
      setForm((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
        newSize: "",
      }));
    }
  };

  const handleRemoveColor = (color: string) =>
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));

  const handleRemoveSize = (size: string) =>
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));

  // ✅ Envoi du formulaire pour mise à jour
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH", // <- ici on utilise PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: parseFloat(form.price),
          discount: form.discount ? parseFloat(form.discount) : 0,
          colors: form.colors,
          sizes: form.sizes,
          inStock: form.inStock,
          images: form.images,
        }),
      });

      if (response.ok) {
        router.push("/products"); // redirection après mise à jour
      } else {
        const err = await response.json();
        console.error("Erreur mise à jour:", err);
      }
    } catch (error) {
      console.error("Erreur mise à jour produit:", error);
    } finally {
      setLoading(false);
    }
  };

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

        <div
          className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}
        >
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

                {/* Couleurs & Tailles */}
                <div className="space-y-2">
                  <Label>Couleurs</Label>
                  <div className="flex gap-2">
                    <Input
                      name="newColor"
                      value={form.newColor}
                      onChange={handleChange}
                      placeholder="Ajouter une couleur..."
                    />
                    <Button type="button" onClick={handleAddColor}>
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"
                      >
                        <span>{color}</span>
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => handleRemoveColor(color)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tailles</Label>
                  <div className="flex gap-2">
                    <Input
                      name="newSize"
                      value={form.newSize}
                      onChange={handleChange}
                      placeholder="Ajouter une taille..."
                    />
                    <Button type="button" onClick={handleAddSize}>
                      Ajouter
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.sizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"
                      >
                        <span>{size}</span>
                        <X
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => handleRemoveSize(size)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={form.inStock}
                    onCheckedChange={(checked) =>
                      setForm((prev) => ({ ...prev, inStock: checked }))
                    }
                  />
                  <Label htmlFor="inStock">En stock</Label>
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
                  <p>Couleurs : {form.colors.join(", ") || "N/A"}</p>
                  <p>Tailles : {form.sizes.join(", ") || "N/A"}</p>
                  <p>Stock : {form.inStock ? "Disponible" : "Rupture"}</p>

                  {form.images.length > 0 && (
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
