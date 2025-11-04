"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
  totalProducts: number;
  productsByCategory: {
    categoryId: string;
    _count: { id: number };
    categoryName?: string;
  }[];
  totalOrders: number;
  ordersByStatus: { status: string; _count: { id: number } }[];
  totalUsers: number;
  revenue?: number;
  conversionRate?: number;
}

// Enhanced color palette with better accessibility
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#84CC16",
  "#6366F1",
  "#EC4899",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  completed: "#10B981",
  cancelled: "#EF4444",
  processing: "#3B82F6",
  shipped: "#8B5CF6",
  delivered: "#84CC16",
};

const CATEGORY_ICONS: Record<string, string> = {
  "1": "📱",
  "2": "👕",
  "3": "🏠",
  "4": "🎮",
  "5": "📚",
  default: "📦",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"day" | "week" | "month" | "year">(
    "month"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/analytics?range=${timeRange}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Failed to load analytics
          </h2>
          <p className="text-gray-600 max-w-md">
            {error || "Please try refreshing the page."}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Enhanced data preparation with fallbacks
  const productsChartData = data.productsByCategory.map((cat, index) => ({
    name: cat.categoryName || `Category ${cat.categoryId}`,
    value: cat._count.id,
    percentage: ((cat._count.id / data.totalProducts) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
    icon: CATEGORY_ICONS[cat.categoryId] || CATEGORY_ICONS.default,
  }));

  const ordersChartData = data.ordersByStatus.map((status) => ({
    name: status.status.charAt(0).toUpperCase() + status.status.slice(1),
    value: status._count.id,
    percentage: ((status._count.id / data.totalOrders) * 100).toFixed(1),
    color: STATUS_COLORS[status.status] || COLORS[0],
  }));

  const totalRevenue = data.revenue || 0;
  const conversionRate = data.conversionRate || 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Enhanced Header with Time Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-00 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Real-time overview of your store performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Live Data
          </Badge>

          <div className="flex  rounded-lg p-1">
            {["day", "week", "month", "year"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range as any)}
                className="text-xs px-3 py-1 rounded-md transition-all duration-200"
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Products"
          value={data.totalProducts.toLocaleString()}
          description={`Across ${data.productsByCategory.length} categories`}
          icon="📦"
          trend={{ value: 12, positive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Orders"
          value={data.totalOrders.toLocaleString()}
          description={`${
            ordersChartData.find((o) => o.name === "Completed")?.value || 0
          } completed`}
          icon="🛒"
          trend={{ value: 8, positive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Users"
          value={data.totalUsers.toLocaleString()}
          description="Registered customers"
          icon="👥"
          trend={{ value: 15, positive: true }}
          loading={loading}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          description={`${conversionRate}% conversion rate`}
          icon="💰"
          trend={{ value: 22, positive: true }}
          loading={loading}
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Products by Category - Enhanced */}
        <ChartCard
          title="Products by Category"
          description="Distribution of products across categories"
          action={
            <Button variant="outline" size="sm">
              View Details
            </Button>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={120}
                  innerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {productsChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} products`, "Count"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ right: -20 }}
                  formatter={(value, entry: any) => (
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Orders by Status - Enhanced */}
        <ChartCard
          title="Orders by Status"
          description="Current order status distribution"
          action={
            <Button variant="outline" size="sm">
              Export Data
            </Button>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ordersChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="opacity-30"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  tick={{ fill: "#6b7280" }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} orders`, "Count"]}
                  labelFormatter={(label) => `Status: ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Orders"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {ordersChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="transition-opacity duration-200 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Enhanced Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreakdownCard
          title="Category Distribution"
          description="Detailed breakdown of product categories"
          items={data.productsByCategory.map((cat) => {
            const percent = (cat._count.id / data.totalProducts) * 100;
            return {
              label: cat.categoryName || `Category ${cat.categoryId}`,
              value: cat._count.id,
              percentage: percent,
              unit: "products",
              icon: CATEGORY_ICONS[cat.categoryId] || CATEGORY_ICONS.default,
            };
          })}
        />

        <BreakdownCard
          title="Order Status Breakdown"
          description="Detailed analysis of order statuses"
          items={data.ordersByStatus.map((status) => {
            const percent = (status._count.id / data.totalOrders) * 100;
            return {
              label:
                status.status.charAt(0).toUpperCase() + status.status.slice(1),
              value: status._count.id,
              percentage: percent,
              unit: "orders",
              color: STATUS_COLORS[status.status] || COLORS[0],
            };
          })}
        />
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <StatItem label="Avg. Order Value" value="$124.50" />
          <StatItem label="Customer Satisfaction" value="4.8/5" />
          <StatItem label="Returning Customers" value="42%" />
          <StatItem label="Stock Alert" value="3 items" alert />
        </div>
      </div>
    </div>
  );
}

// Enhanced Metric Card Component
function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
  loading,
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend?: { value: number; positive: boolean };
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-12" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 bg-gradient-to-br from-white to-gray-50/50 group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-600">{description}</p>
          {trend && (
            <Badge
              variant="outline"
              className={`text-xs ${
                trend.positive
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Chart Card Component
function ChartCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-0 ">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// Enhanced Breakdown Card Component
function BreakdownCard({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: {
    label: string;
    value: number;
    percentage: number;
    unit: string;
    icon?: string;
    color?: string;
  }[];
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg border-0 ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm  text-gray-900 dark:text-gray-100 mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.label} className="space-y-2 group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {item.icon && (
                  <span className="text-lg transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>
                )}
                <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {item.value.toLocaleString()} {item.unit}
                </span>
                <Badge
                  variant="secondary"
                  className="min-w-12 text-center text-xs bg-gray-100 dark:bg-gray-700"
                >
                  {item.percentage.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <Progress
              value={item.percentage}
              className="h-2 transition-all duration-500 ease-out group-hover:h-3"
              style={{
                backgroundColor: "var(--color-bg)",
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// New Stat Item Component
function StatItem({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
        alert
          ? "bg-orange-50 border border-orange-200"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div
        className={`font-semibold ${
          alert ? "text-orange-600" : "text-gray-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

// Enhanced Skeleton Loader
function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-lg" />
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-80 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breakdown Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-0">
            <CardHeader>
              <Skeleton className="h-6 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-12 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
