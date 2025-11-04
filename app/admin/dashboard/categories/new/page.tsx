"use client";

import { useEffect, useState } from "react";
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
const CreateCategory = () => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#3b82f6");

  // 🔹 Récupère toutes les catégories parentes
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await fetch("/api/category-parents");
        if (!res.ok)
          throw new Error("Erreur de chargement des catégories parentes");
        const data = await res.json();
        setParents(data);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de charger les catégories parentes");
      }
    };
    fetchParents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setLoading(true);

    const promise = fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        parentId: parentId || null,
        images,
        sizes,
        colors,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create category");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: "Creating category...",
      success: (data) => {
        setName("");
        setParentId(null);
        setImages([]);
        setSizes([]);
        setColors([]);
        setShowColorPicker(false);
        setCurrentColor("#3b82f6");
        return `Category "${data.name}" created successfully`;
      },
      error: (err) => {
        console.error(err);
        return err.message || "Failed to create category";
      },
      finally: () => setLoading(false),
    });
  };

  // 🔹 Gestion couleurs
  const addColor = (colorHex: string) => {
    if (!colors.includes(colorHex)) {
      setColors([...colors, colorHex]);
      toast.success(`Color ${colorHex} added`);
    } else {
      toast.error("This color has already been added");
    }
  };
  const handleColorChange = (color: any) => setCurrentColor(color.hex);
  const confirmColor = () => {
    addColor(currentColor);
    setShowColorPicker(false);
  };

  // 🔹 Gestion tailles
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" /> Create Category
        </CardTitle>
        <CardDescription>
          Add a new category and assign it to a parent category
        </CardDescription>
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

          {/* Parent Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Parent Category</label>
            <Select
              value={parentId || ""}
              onValueChange={(val) => setParentId(val || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
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

          {/* Colors */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Colors</label>
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

            {showColorPicker && (
              <div className="p-4 border rounded-lg bg-background shadow-lg">
                <div className="flex flex-col gap-4">
                  <SketchPicker
                    color={currentColor}
                    onChange={handleColorChange}
                    disableAlpha
                  />
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
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                Category...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create Category
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default CreateCategory;
