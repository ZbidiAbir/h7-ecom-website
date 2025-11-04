"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JSX, useEffect, useState } from "react";
import UserCard from "./UserCard";
import { PiCubeTransparentLight } from "react-icons/pi";

// Import icons from react-icons
import {
  FaBoxOpen,
  FaClipboardList,
  FaCog,
  FaFileInvoice,
  FaListAlt,
  FaPlusCircle,
  FaTags,
  FaFolderPlus,
  FaUserAlt,
} from "react-icons/fa";
import { TfiDashboard } from "react-icons/tfi";

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
  badge?: number;
}

interface AnalyticsData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalInvoices: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalInvoices: 0,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const data = await res.json();
        setAnalytics({
          totalProducts: data.totalProducts,
          totalOrders: data.totalOrders,
          totalUsers: data.totalUsers,
          totalInvoices: data.totalInvoices,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchAnalytics();
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/admin/dashboard",
      label: "Dashboard Overview",
      icon: <TfiDashboard className="text-lg" />,
    },
    {
      href: "/admin/dashboard/users",
      label: "Clients",
      icon: <FaUserAlt className="text-lg" />,
    },
    {
      href: "/admin/dashboard/prods",
      label: "Products",
      icon: <FaBoxOpen className="text-lg" />,
      badge: analytics.totalProducts,
    },
    {
      href: "/admin/dashboard/category-parent",
      label: "Category Parent",
      icon: <PiCubeTransparentLight className="text-lg" />,
    },
    {
      href: "/admin/dashboard/categories",
      label: "Categories",
      icon: <FaTags className="text-lg" />,
    },
    {
      href: "/admin/dashboard/categories/new",
      label: "Add Category",
      icon: <FaFolderPlus className="text-lg" />,
    },
    {
      href: "/admin/dashboard/prods/new",
      label: "Add Product",
      icon: <FaPlusCircle className="text-lg" />,
    },
    {
      href: "/admin/dashboard/orders",
      label: "Orders",
      icon: <FaClipboardList className="text-lg" />,
      badge: analytics.totalOrders,
    },
    {
      href: "/admin/dashboard/invoices",
      label: "Invoices",
      icon: <FaFileInvoice className="text-lg" />,
      badge: analytics.totalInvoices,
    },
    {
      href: "/admin/dashboard/settings",
      label: "Settings",
      icon: <FaCog className="text-lg" />,
    },
  ];

  const isActive = (href: string) => pathname === href;
  const isChildActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 backdrop-blur-xl bg-white/70 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-700/50 shadow-md flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 border-b border-gray-100/60 dark:border-gray-700/60 bg-gradient-to-r from-gray-50/60 to-white/70 dark:from-gray-800/70 dark:to-gray-900/70">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          HASH<span className="text-gray-600 dark:text-gray-400">SEVEN</span>
        </h1>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-6">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const childActive = isChildActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 overflow-hidden",
                  active
                    ? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
                    : childActive
                    ? "bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                {/* Animated side line */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-[4px] bg-gray-400 rounded-r-md" />
                )}

                {/* Main content */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  {item.icon}
                  <span
                    className={cn(
                      "text-sm truncate font-medium",
                      active ? "font-semibold" : "font-normal"
                    )}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Badge */}
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r",
                      active
                        ? "from-white/40 to-white/30 text-white"
                        : "from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User */}
      <Card className="rounded-none border-0 bg-gradient-to-t from-gray-50 to-white dark:from-gray-800/70 dark:to-gray-900/60 shadow-inner border-t border-gray-100/60 dark:border-gray-700/60">
        <CardContent className="p-4">
          <UserCard />
        </CardContent>
      </Card>
    </aside>
  );
}
