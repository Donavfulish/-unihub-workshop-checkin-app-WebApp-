"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { RouteGuard } from "@/components/route-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { getWorkshopStatsAction } from "@/src/actions/modules/workshop.actions";

interface WorkshopStatsItem {
  id: number;
  title: string;
  start_time?: string | null;
  end_time?: string | null;
  category?: string | null;
  registered: number;
  total_slots?: number | null;
  remaining_slots?: number | null;
}

interface WorkshopStatsResponse {
  ongoing_workshops: WorkshopStatsItem[];
  total_registrations: number;
  total_workshops?: number;
  per_category?: Record<string, { workshops: number; registrations: number }>;
}

export default function AdminWorkshopStatsPage() {
  const { accessToken } = useAuth();
  const [stats, setStats] = useState<WorkshopStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const json = await getWorkshopStatsAction(accessToken);
        if (!mounted) return;
        if (json?.data) {
          setStats(json.data as WorkshopStatsResponse);
        } else if (json?.error) {
          setError(json.error.message || "Failed to load stats");
        } else {
          setError("Invalid response");
        }
      } catch (err: any) {
        if (!mounted) return;
        console.error(err);
        setError(err?.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  return (
    <RouteGuard roles={["admin"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Workshop Statistics</h1>
              <p className="text-muted-foreground">
                Live overview of ongoing workshops and registrations.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/workshops">
                <Button variant="ghost">Back to Workshops</Button>
              </Link>
              <Button
                onClick={() => {
                  if (!accessToken) return;
                  setLoading(true);
                  setStats(null);
                  setError(null);
                  getWorkshopStatsAction(accessToken)
                    .then((j) => {
                      if (j?.data) setStats(j.data as WorkshopStatsResponse);
                      else
                        setError(j?.error?.message || "Failed to load stats");
                    })
                    .catch((e) => setError(e?.message))
                    .finally(() => setLoading(false));
                }}
              >
                Refresh
              </Button>
            </div>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Loading workshop statistics...
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="p-8 text-center text-destructive">
                {error}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.total_registrations ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      All active registrations
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ongoing Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.ongoing_workshops?.length ?? 0}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Workshops happening now
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Workshops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {stats?.total_workshops ?? "—"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total workshops (optional)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {stats?.per_category && (
                <Card>
                  <CardHeader>
                    <CardTitle>By Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.entries(stats.per_category).map(([cat, v]) => (
                        <div
                          key={cat}
                          className="p-4 border border-border rounded"
                        >
                          <div className="text-sm text-muted-foreground">
                            {cat}
                          </div>
                          <div className="text-xl font-bold">
                            {v.workshops} workshops
                          </div>
                          <div className="text-sm">
                            {v.registrations} registrations
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Ongoing Workshops</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Category
                        </TableHead>
                        <TableHead className="text-center">
                          Registered
                        </TableHead>
                        <TableHead className="text-center">Capacity</TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Time
                        </TableHead>
                        <TableHead className="text-center w-10">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats?.ongoing_workshops?.length ? (
                        stats!.ongoing_workshops.map((w) => (
                          <TableRow key={w.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div>
                                <div className="font-medium text-sm">
                                  {w.title}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary">
                                {w.category ?? "—"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-sm font-medium">
                                {w.registered}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-sm font-medium">
                                {w.total_slots ?? "—"}
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="text-sm text-muted-foreground">
                                {w.start_time
                                  ? new Date(w.start_time).toLocaleString()
                                  : "—"}
                                {w.end_time
                                  ? ` • ${new Date(w.end_time).toLocaleString()}`
                                  : ""}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Link href={`/workshops/${w.id}`}>
                                <Button size="sm">View</Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center p-8 text-muted-foreground"
                          >
                            No ongoing workshops
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </RouteGuard>
  );
}
