"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SketchPicker } from "react-color";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Palette, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = {
  id: string;
  name: string;
  images: { id: string; url: string }[];
  sizes: { id: string; size: string }[];
  colors: { id: string; color: string }[];
  parent?: {
    id: string;
    name: string;
  };
};

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3b82f6");
  const [parentId, setParentId] = useState<string | null>(null);

  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
  interface EditCategoryProps {
    categoryId: string;
    onSuccess?: () => void;
  }
  // Fetch category details
  const fetchCategory = async () => {
    try {
      setFetching(true);
      const res = await fetch(`/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data: Category[] = await res.json();
      const found = data.find((c) => c.id === categoryId);
      if (!found) throw new Error("Category not found");
      const categoryRes = await fetch(`/api/categories/${categoryId}`);
      if (!categoryRes.ok) {
        throw new Error("Erreur de chargement de la catégorie");
      }
      const categoryData = await categoryRes.json();

      setCategory(found);
      setName(found.name);
      setImages(found.images.map((img) => img.url));
      setSizes(found.sizes.map((s) => s.size));
      setColors(found.colors.map((c) => c.color));
      setParentId(categoryData.parentId);
      const parentsRes = await fetch("/api/category-parents");
      if (!parentsRes.ok) {
        throw new Error("Erreur de chargement des catégories parentes");
      }
      const parentsData = await parentsRes.json();
      const filteredParents = parentsData.filter(
        (parent: { id: string }) => parent.id !== categoryId
      );
      setParents(filteredParents);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load category");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);
    const promise = fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: categoryId,
        name: name.trim(),
        images,
        sizes,
        colors,
        parentId: parentId || null,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to update category");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: "Updating category...",
      success: (data) => {
        router.push("/admin/dashboard/categories");
        return `Category "${data.name}" updated successfully`;
      },
      error: (err) => {
        console.error(err);
        return err.message || "Failed to update category";
      },
      finally: () => setLoading(false),
    });
  };

  // Fonction pour ajouter une couleur
  const addColor = (colorHex: string) => {
    if (!colors.includes(colorHex)) {
      setColors([...colors, colorHex]);
      toast.success(`Color ${colorHex} added`);
    } else {
      toast.error("This color has already been added");
    }
  };

  // Fonction pour gérer le changement de couleur
  const handleColorChange = (color: any) => {
    setCurrentColor(color.hex);
  };

  // Fonction pour confirmer l'ajout de couleur
  const confirmColor = () => {
    addColor(currentColor);
    setShowColorPicker(false);
  };

  // Fonction pour ajouter une taille avec Enter
  const handleSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !sizes.includes(value)) {
        setSizes([...sizes, value]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Edit Category
        </CardTitle>
        <CardDescription>Update your category details below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium">
              Category Name *
            </label>
            <Input
              id="category-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              disabled={loading}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Catégorie Parente</label>
            <Select
              value={parentId || "none"}
              onValueChange={(val) => setParentId(val === "none" ? null : val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une catégorie parente (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune catégorie parente</SelectItem>
                {parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <ImageUpload
              value={images}
              onChange={(url) => setImages([...images, url])}
              onRemove={(url) => setImages(images.filter((i) => i !== url))}
              disabled={loading}
            />
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Sizes</label>
            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
              {sizes.map((size, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                >
                  <span className="text-sm">{size}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Input
              type="text"
              placeholder="Add size and press Enter"
              onKeyDown={handleSizeKeyDown}
              disabled={loading}
            />
          </div>

          {/* Colors avec Color Picker */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Colors</label>

            {/* Palette de couleurs sélectionnées */}
            <div className="flex flex-wrap gap-2 min-h-[3rem] p-2 border rounded-lg bg-muted/20">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background border rounded-lg pl-2 pr-1 py-1 shadow-sm"
                >
                  <div
                    className="w-6 h-6 rounded border shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                  <span className="text-xs font-mono max-w-[80px] truncate">
                    {color}
                  </span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() =>
                      setColors(colors.filter((_, i) => i !== idx))
                    }
                    disabled={loading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {colors.length === 0 && (
                <div className="text-muted-foreground text-sm italic">
                  No colors added yet
                </div>
              )}
            </div>

            {/* Bouton pour ouvrir le color picker */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 w-full"
              disabled={loading}
            >
              <Palette className="h-4 w-4" />
              {showColorPicker ? "Close Color Picker" : "Pick a Color"}
            </Button>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="p-4 border rounded-lg bg-background shadow-lg">
                <div className="flex flex-col gap-4">
                  <SketchPicker
                    color={currentColor}
                    onChange={handleColorChange}
                    disableAlpha={true}
                  />

                  {/* Aperçu de la couleur actuelle */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded border shadow-md"
                        style={{ backgroundColor: currentColor }}
                      />
                      <div>
                        <div className="font-mono text-sm font-medium">
                          {currentColor}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Current selection
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={confirmColor}
                      className="flex-1"
                      disabled={loading}
                    >
                      Add Color
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowColorPicker(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Indicateur du nombre de couleurs */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {colors.length} color{colors.length !== 1 ? "s" : ""} selected
              </span>
              {colors.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setColors([])}
                  disabled={loading}
                  className="h-6 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Category...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Update Category
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
