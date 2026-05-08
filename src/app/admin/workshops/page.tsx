"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { RouteGuard } from "@/components/route-guard";
import { WorkshopTable } from "@/components/workshop-table";
import { WorkshopFormModal } from "@/components/workshop-form-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workshop } from "@/lib/types";
import { toast } from "sonner";
import {
  getWorkshopsAction,
  deleteWorkshopAction,
} from "@/actions/modules/workshop.actions";
import { useAuth } from "@/contexts/auth-context";

export default function WorkshopManagementPage() {
  const { accessToken } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingWorkshopId, setEditingWorkshopId] = useState<string | null>(
    null,
  );
  const [editingInitialValues, setEditingInitialValues] = useState<any | null>(
    null,
  );

  const filteredWorkshops = workshops;

  // Load workshops from API
  const loadWorkshops = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const result = await getWorkshopsAction(accessToken);
      if (result.data && Array.isArray(result.data.workshops)) {
        // Convert API response to Workshop format if needed
        const formattedWorkshops = result.data.workshops.map((w: any) => ({
          ...w,
          date: new Date(w.start_time || Date.now()).toLocaleDateString(),
          time: new Date(w.start_time || Date.now()).toLocaleTimeString(),
          location: w.location || "Online",
          registered: w.total_slots
            ? w.total_slots - (w.remaining_slots || 0)
            : 0,
          capacity: w.total_slots || 0,
          price: typeof w.fee === "number" ? w.fee : 0,
          room_id: w.room_id ?? null,
          image: w.image || "/default-workshop.jpg",
          aiSummary: w.aiSummary || "",
          syllabus: w.syllabus || "",
          tags: w.tags || [],
        }));
        setWorkshops(formattedWorkshops);
      } else {
        setWorkshops([]);
      }
    } catch (error) {
      console.error("Error loading workshops:", error);
      toast.error("Failed to load workshops from backend.");
      setWorkshops([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load workshops on mount
  useEffect(() => {
    loadWorkshops();
  }, [accessToken]);

  const handleEdit = (workshop: Workshop) => {
    // Format datetime-local expects: YYYY-MM-DDTHH:mm
    const formatDatetimeLocal = (isoString: string | undefined) => {
      if (!isoString) return "";
      try {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch {
        return "";
      }
    };

    setEditingWorkshopId(String(workshop.id));
    setEditingInitialValues({
      title: workshop.title || "",
      description: workshop.description || "",
      start_time: formatDatetimeLocal((workshop as any).start_time),
      end_time: formatDatetimeLocal((workshop as any).end_time),
      room_id: (workshop as any).room_id ?? 0,
      total_slots: workshop.capacity,
      fee: workshop.price,
    });
    setEditOpen(true);
  };

  const handleDelete = async (workshopId: string) => {
    try {
      setIsLoading(true);
      await deleteWorkshopAction(workshopId, accessToken || undefined);
      setWorkshops((prev) => prev.filter((w) => w.id !== workshopId));
      toast.success("Workshop deleted successfully");
    } catch (error) {
      console.error("Error deleting workshop:", error);
      toast.error("Failed to delete workshop");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadWorkshops();
    toast.success("Workshops refreshed");
  };

  return (
    <RouteGuard roles={["admin"]}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Workshop Management</h1>
            <p className="text-muted-foreground">
              Manage all workshops on the platform. Create, edit, or delete
              workshops.
            </p>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="ml-auto">
                  <WorkshopFormModal
                    onSuccess={loadWorkshops}
                    token={accessToken || undefined}
                  />
                  {/* Edit Modal (controlled) */}
                  <WorkshopFormModal
                    mode="edit"
                    id={editingWorkshopId ?? undefined}
                    initialValues={editingInitialValues ?? undefined}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSuccess={loadWorkshops}
                    token={accessToken || undefined}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Workshops
                  </p>
                  <p className="text-3xl font-bold">{workshops.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Filtered Results
                  </p>
                  <p className="text-3xl font-bold">
                    {filteredWorkshops.length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Registrations
                  </p>
                  <p className="text-3xl font-bold">
                    {workshops.reduce((sum, w) => sum + w.registered, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workshops Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Workshops</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">
                    Loading workshops...
                  </div>
                </div>
              ) : (
                <WorkshopTable
                  workshops={filteredWorkshops}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </RouteGuard>
  );
}
