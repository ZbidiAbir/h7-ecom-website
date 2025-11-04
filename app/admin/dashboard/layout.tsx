"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("prods/new")) return "Ajouter un produit";
    if (pathname.includes("categories/new")) return "Ajouter une catégorie";
    if (pathname.includes("prods")) return "Gestion des produits";
    if (pathname.includes("categories")) return "Gestion des catégories";
    if (pathname.includes("settings")) return "Paramètres";
    if (pathname.includes("orders")) return "Gestion des commandes";
    if (pathname.includes("invoices")) return "Gestion des factures"; // ajouté
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen ">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto  p-4">
          <div className="mx-auto  rounded-xl shadow-sm border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
