"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { AdminStatsCard } from "@/components/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, BookOpen, DollarSign } from "lucide-react";
import {
  getWorkshopStatsAction,
  getWorkshopsAction,
} from "@/src/actions/modules/workshop.actions";
import type { Workshop } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

const chartData = [
  {
    month: "Jan",
    registrations: 400,
    revenue: 1000,
  },
  {
    month: "Feb",
    registrations: 520,
    revenue: 1500,
  },
  {
    month: "Mar",
    registrations: 680,
    revenue: 2100,
  },
  {
    month: "Apr",
    registrations: 850,
    revenue: 2800,
  },
  {
    month: "May",
    registrations: 950,
    revenue: 3200,
  },
];

export default function AdminDashboard() {
  const { accessToken } = useAuth();
  const [apiTotalRegistrations, setApiTotalRegistrations] = useState<
    number | null
  >(null);
  const [ongoingWorkshopsCount, setOngoingWorkshopsCount] = useState<
    number | null
  >(null);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoadingWorkshops, setIsLoadingWorkshops] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    async function loadStats() {
      try {
        const res = await getWorkshopStatsAction(accessToken || undefined);
        // expecting ApiResponse-like shape: { data: { ongoing_workshops, total_registrations } }
        const data = res?.data;
        if (!mounted) return;
        if (data) {
          setApiTotalRegistrations(data.total_registrations ?? null);
          setOngoingWorkshopsCount(
            Array.isArray(data.ongoing_workshops)
              ? data.ongoing_workshops.length
              : null,
          );
        }
      } catch (err) {
        console.error("Failed to load workshop stats", err);
      }
    }
    loadStats();
    return () => {
      mounted = false;
    };
    async function loadWorkshops() {
      setIsLoadingWorkshops(true);
      try {
        const res = await getWorkshopsAction(accessToken || undefined);
        if (res?.data?.workshops && Array.isArray(res.data.workshops)) {
          const formatted = res.data.workshops.map((w: any) => ({
            ...w,
            category: w.category || "General",
            instructor: w.instructor || "TBD",
            date: w.start_time
              ? new Date(w.start_time).toLocaleDateString()
              : new Date().toLocaleDateString(),
            time: w.start_time
              ? new Date(w.start_time).toLocaleTimeString()
              : new Date().toLocaleTimeString(),
            location: w.location || "Online",
            level: w.level || ("Beginner" as const),
            registered: w.total_slots
              ? w.total_slots - (w.remaining_slots || 0)
              : w.registered || 0,
            capacity: w.total_slots || w.capacity || 0,
            price: typeof w.fee === "number" ? w.fee : w.price || 0,
            image: w.image || "/default-workshop.jpg",
          }));
          if (mounted) setWorkshops(formatted);
        }
      } catch (e) {
        console.error("Failed to load workshops for dashboard", e);
      } finally {
        if (mounted) setIsLoadingWorkshops(false);
      }
    }
    loadWorkshops();
    return () => {
      mounted = false;
    };
  }, [accessToken]);
  const totalRevenue = workshops.reduce(
    (sum, w) => sum + (w.price || 0) * (w.registered || 0),
    0,
  );
  const totalRegistrations = workshops.reduce(
    (sum, w) => sum + (w.registered || 0),
    0,
  );
  const activeWorkshops = workshops.filter(
    (w) => (w.registered || 0) > 0,
  ).length;

  return (
    <RouteGuard roles={["admin"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s an overview of your workshop platform.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <AdminStatsCard
              title="Total Registrations"
              value={apiTotalRegistrations ?? totalRegistrations}
              icon={Users}
              description={`${apiTotalRegistrations ?? totalRegistrations} active registrations`}
              trend={{ value: 12, isPositive: true }}
            />
            <AdminStatsCard
              title="Ongoing Workshops"
              value={ongoingWorkshopsCount ?? activeWorkshops}
              icon={BookOpen}
              description={`${ongoingWorkshopsCount ?? activeWorkshops} running now`}
              trend={{ value: 5, isPositive: true }}
            />
            <AdminStatsCard
              title="Total Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              description="From all workshops"
              trend={{ value: 8, isPositive: true }}
            />
            <AdminStatsCard
              title="Avg. Registration Rate"
              value={`${(() => {
                const totalCap = workshops.reduce(
                  (s: number, w: Workshop) => s + (w.capacity || 0),
                  0,
                );
                if (!totalCap) return "—";
                return `${Math.round((totalRegistrations / totalCap) * 100)}%`;
              })()}`}
              icon={TrendingUp}
              description="Workshop capacity filled"
              trend={{ value: 3, isPositive: true }}
            />
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Registrations & Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="var(--color-muted-foreground)"
                      />
                      <YAxis stroke="var(--color-muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-background)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius)",
                        }}
                        labelStyle={{ color: "var(--color-foreground)" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="registrations"
                        fill="var(--color-primary)"
                      />
                      <Bar dataKey="revenue" fill="var(--color-secondary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">
                      Avg. Per Workshop
                    </span>
                    <span className="font-bold">
                      {workshops.length
                        ? Math.round(totalRegistrations / workshops.length)
                        : 0}{" "}
                      registrations
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">
                      Avg. Price
                    </span>
                    <span className="font-bold">
                      $ $
                      {(workshops.length
                        ? workshops.reduce(
                            (sum: number, w: Workshop) => sum + (w.price || 0),
                            0,
                          ) / workshops.length
                        : 0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Sold Out
                    </span>
                    <span className="font-bold">
                      {
                        workshops.filter(
                          (w) => (w.registered || 0) === (w.capacity || 0),
                        ).length
                      }{" "}
                      workshops
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Workshops */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Workshops</CardTitle>
                <a
                  href="/admin/workshops"
                  className="text-primary text-sm hover:underline"
                >
                  View All →
                </a>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshops.slice(0, 3).map((workshop) => (
                  <Card key={workshop.id}>
                    <CardContent className="pt-6 space-y-2">
                      <p className="font-semibold text-sm">{workshop.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {String(workshop.description || "").substring(0, 100)}
                        ...
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-muted-foreground">
                          {workshop.registered}/{workshop.capacity} registered
                        </p>
                        <p className="text-sm font-semibold">
                          ${workshop.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workshop Management Section */}
          <Card>
            <CardHeader>
              <CardTitle>Workshop Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create and manage workshops on the platform. Click the button
                below to access the full workshop management interface.
              </p>
              <div className="flex gap-3">
                <Link href="/admin/workshops" className="inline-block">
                  <Button variant="default">Go to Workshop Management</Button>
                </Link>
                <Link href="/admin/workshops/stats" className="inline-block">
                  <Button variant="outline">View Stats</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </RouteGuard>
  );
}
