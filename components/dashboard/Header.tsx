"use client";
import { Bell, Calendar } from "lucide-react";
import AuthButton from "../auth-button";
import { ThemeToggle } from "@/app/admin/dashboard/components/ThemeToggle";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 left-64 right-0 bg-background shadow-sm border-b z-20">
      <div className="px-8 py-4 flex justify-between items-center">
        {/* Left section - Title and date */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span>{today}</span>
          </div>
        </div>

        {/* Right section - Actions and user controls */}
        <div className="flex items-center gap-4">
          {/* Notification bell */}
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-background"></span>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth button */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
