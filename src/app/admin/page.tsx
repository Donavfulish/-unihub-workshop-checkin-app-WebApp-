"use client";

import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/route-guard";
import { AdminStatsCard } from "@/components/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AdminWorkshopManagement } from "@/components/admin-workshop-management";
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

          <AdminWorkshopManagement />
        </main>
      </div>
    </RouteGuard>
  );
}
