"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Liste des utilisateurs
        </h1>
        <Link href="/admin/dashboard/users/new">
          <Button>➕ Ajouter un utilisateur</Button>
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Aucun utilisateur trouvé pour le moment.
          </p>
        </div>
      ) : (
        <Table className="border rounded-lg bg-white shadow-sm">
          <TableCaption>
            {users.length} utilisateur{users.length > 1 ? "s" : ""}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-blue-50/40">
                <TableCell className="font-medium">
                  {user.name || "—"}
                </TableCell>
                <TableCell>{user.email || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/admin/dashboard/users/${user.id}`}>
                    <Button size="sm" variant="outline">
                      Détails
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );

  // ✅ Suppression d’un utilisateur
  async function handleDelete(id: string) {
    if (confirm("Supprimer cet utilisateur ?")) {
      try {
        const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== id));
        } else {
          console.error("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }
    }
  }
}
