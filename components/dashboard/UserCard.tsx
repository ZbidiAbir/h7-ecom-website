"use client";

import { useSession } from "next-auth/react";

export default function UserCard() {
  const { data: session, status } = useSession();

  const getInitials = (name: any) => {
    return (
      name
        ?.split(" ")
        .map((part: any) => part[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm border border-gray-200 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">?</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 text-sm font-medium">Non connecté</p>
          <p className="text-gray-500 text-xs">Connectez-vous</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-medium">
          {getInitials(session.user.name)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">Admin HASHSEVEN</p>
        <p className="text-gray-900 text-sm font-medium truncate">
          {session.user.name || "Utilisateur"}
        </p>
        <p className="text-gray-500 text-xs truncate">{session.user.email}</p>
      </div>
    </div>
  );
}
