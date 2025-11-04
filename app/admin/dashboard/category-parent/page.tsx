"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Loader2, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  parentName?: string;
}

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [deletePopup, setDeletePopup] = useState<{
    isOpen: boolean;
    category: Category | null;
  }>({
    isOpen: false,
    category: null,
  });
  const [renamePopup, setRenamePopup] = useState<{
    isOpen: boolean;
    category: Category | null;
    newName: string;
    loading: boolean;
  }>({
    isOpen: false,
    category: null,
    newName: "",
    loading: false,
  });

  // Charger toutes les catégories
  const fetchCategories = async () => {
    setTableLoading(true);
    try {
      const res = await fetch("/api/category-parents");
      if (!res.ok) throw new Error("Erreur de chargement des catégories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les catégories");
    } finally {
      setTableLoading(false);
    }
  };

  // Charger les catégories au chargement du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Veuillez entrer un nom de catégorie");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/category-parents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), parentId }),
      });
      if (!res.ok) throw new Error("Échec de la création de la catégorie");
      const data = await res.json();
      setName("");
      setParentId(null);
      toast.success(`Catégorie "${data.name}" créée avec succès`);

      // Recharger la liste des catégories
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const openDeletePopup = (category: Category) => {
    setDeletePopup({
      isOpen: true,
      category,
    });
  };

  const closeDeletePopup = () => {
    setDeletePopup({
      isOpen: false,
      category: null,
    });
  };

  const openRenamePopup = (category: Category) => {
    setRenamePopup({
      isOpen: true,
      category,
      newName: category.name,
      loading: false,
    });
  };

  const closeRenamePopup = () => {
    setRenamePopup({
      isOpen: false,
      category: null,
      newName: "",
      loading: false,
    });
  };

  const handleDelete = async () => {
    if (!deletePopup.category) return;

    const { id, name } = deletePopup.category;

    try {
      const res = await fetch(`/api/category-parents`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Échec de la suppression de la catégorie");

      toast.success(`Catégorie "${name}" supprimée avec succès`);
      closeDeletePopup();

      // Recharger la liste des catégories
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  const handleRename = async () => {
    if (!renamePopup.category || !renamePopup.newName.trim()) {
      toast.error("Veuillez entrer un nouveau nom valide");
      return;
    }

    if (renamePopup.newName === renamePopup.category.name) {
      toast.info("Le nom est identique à l'actuel");
      closeRenamePopup();
      return;
    }

    setRenamePopup((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`/api/category-parents`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: renamePopup.category.id,
          name: renamePopup.newName.trim(),
        }),
      });

      if (!res.ok) throw new Error("Échec du renommage de la catégorie");

      toast.success(
        `Catégorie renommée en "${renamePopup.newName}" avec succès`
      );
      closeRenamePopup();

      // Recharger la liste des catégories
      await fetchCategories();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors du renommage");
    } finally {
      setRenamePopup((prev) => ({ ...prev, loading: false }));
    }
  };

  // Filtrer les catégories racines (sans parent)
  const rootCategories = categories.filter((category) => !category.parentId);

  return (
    <div className="space-y-6">
      {/* Formulaire de création */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Category
          </CardTitle>
          <CardDescription>
            Ajoutez un nom et sélectionnez une catégorie parente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Parent Category Name *
              </label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                disabled={loading}
              />
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
                  <Plus className="mr-2 h-4 w-4" /> Create Parent Category
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tableau des catégories */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Liste des Catégories</CardTitle>
          <CardDescription>
            Toutes les catégories créées dans le système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tableLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune catégorie créée pour le moment
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openRenamePopup(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeletePopup(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Popup de confirmation de suppression */}
      {deletePopup.isOpen && deletePopup.category && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Confirmer la suppression
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDeletePopup}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer la catégorie{" "}
              <span className="font-semibold text-red-600">
                "{deletePopup.category.name}"
              </span>
              ? Cette action est irréversible.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeDeletePopup}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de renommage */}
      {renamePopup.isOpen && renamePopup.category && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Renommer la catégorie</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeRenamePopup}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600">
                Ancien nom :{" "}
                <span className="font-semibold">
                  {renamePopup.category.name}
                </span>
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="new-category-name"
                  className="text-sm font-medium"
                >
                  Nouveau nom *
                </label>
                <Input
                  id="new-category-name"
                  value={renamePopup.newName}
                  onChange={(e) =>
                    setRenamePopup((prev) => ({
                      ...prev,
                      newName: e.target.value,
                    }))
                  }
                  placeholder="Entrez le nouveau nom"
                  disabled={renamePopup.loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleRename();
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeRenamePopup}
                disabled={renamePopup.loading}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleRename}
                disabled={renamePopup.loading || !renamePopup.newName.trim()}
                className="flex-1"
              >
                {renamePopup.loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Renommage...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Renommer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
