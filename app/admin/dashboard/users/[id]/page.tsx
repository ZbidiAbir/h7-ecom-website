"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Utilisateur introuvable.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Détails de l’utilisateur
      </h1>

      <div className="space-y-4 border rounded-lg p-6 bg-white shadow-sm">
        <p>
          <strong>Nom :</strong> {user.name || "—"}
        </p>
        <p>
          <strong>Email :</strong> {user.email}
        </p>
        <p>
          <strong>Rôle :</strong> {user.role}
        </p>
        <p>
          <strong>Date de création :</strong>{" "}
          {new Date(user.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>

      <div className="mt-8 flex space-x-4">
        <Link href="/users">
          <Button variant="outline">⬅ Retour</Button>
        </Link>
        <Button
          variant="destructive"
          onClick={async () => {
            if (confirm("Supprimer cet utilisateur ?")) {
              await fetch(`/api/users/${id}`, { method: "DELETE" });
              router.push("/users");
            }
          }}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
