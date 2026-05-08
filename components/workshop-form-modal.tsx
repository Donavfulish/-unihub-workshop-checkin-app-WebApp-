"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  createWorkshopAction,
  updateWorkshopAction,
} from "@/actions/modules/workshop.actions";
import { getRoomsAction } from "@/actions/modules/room.actions";
import type { RoomResponse } from "@/types";

const workshopFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  room_id: z.coerce.number().min(1, "Room is required"),
  total_slots: z.coerce.number().min(1, "Total slots must be at least 1"),
  fee: z.coerce.number().min(0, "Fee must be 0 or greater").default(0),
});

type WorkshopFormValues = z.infer<typeof workshopFormSchema>;

interface WorkshopFormModalProps {
  onSuccess?: () => void;
  initialValues?: Partial<WorkshopFormValues>;
  mode?: "create" | "edit";
  id?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  token?: string;
}

export function WorkshopFormModal({
  onSuccess,
  initialValues,
  mode = "create",
  id,
  open: openProp,
  onOpenChange,
  token,
}: WorkshopFormModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof openProp === "boolean" ? openProp : internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [isLoading, setIsLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const form = useForm<WorkshopFormValues>({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_time: "",
      end_time: "",
      room_id: 0,
      total_slots: 30,
      fee: 0,
    },
  });

  useEffect(() => {
    const loadRooms = async () => {
      if (!open) return;

      setRoomsLoading(true);
      try {
        const result = await getRoomsAction(token || undefined);
        if (result?.data?.rooms && Array.isArray(result.data.rooms)) {
          setRooms(result.data.rooms);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("[workshop-form-modal] Error loading rooms:", error);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };

    loadRooms();
  }, [open, token]);

  // Reset form values when initialValues changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && initialValues && open) {
      console.log(
        "[workshop-form-modal] Resetting form with initialValues:",
        initialValues,
      );
      form.reset({
        title: initialValues.title ?? "",
        description: initialValues.description ?? "",
        start_time: initialValues.start_time ?? "",
        end_time: initialValues.end_time ?? "",
        room_id: initialValues.room_id ?? 0,
        total_slots: initialValues.total_slots ?? 30,
        fee: initialValues.fee ?? 0,
      });
    } else if (mode === "create" && open) {
      form.reset({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        room_id: 0,
        total_slots: 30,
        fee: 0,
      });
    }
  }, [initialValues, open, mode, form]);

  async function onSubmit(values: WorkshopFormValues) {
    setIsLoading(true);
    try {
      // Ensure all values are properly serializable
      const feeValue = typeof values.fee === "number" ? values.fee : undefined;
      console.log("[workshop-form-modal] Form values:", {
        ...values,
        fee: feeValue,
      });

      const payload = {
        title: String(values.title),
        description: String(values.description),
        fee: feeValue,
        total_slots: Number(values.total_slots),
        remaining_slots: Number(values.total_slots),
        start_time: String(values.start_time),
        end_time: String(values.end_time),
        room_id: Number(values.room_id),
      };

      console.log("[workshop-form-modal] Payload to send:", payload);

      let result: any;
      if (mode === "edit" && id) {
        result = await updateWorkshopAction(id, payload, token || undefined);
      } else {
        result = await createWorkshopAction(payload, token || undefined);
      }

      // Check if response has data (success) or error
      if (result?.data) {
        toast.success(
          mode === "edit"
            ? `Workshop "${values.title}" updated successfully!`
            : `Workshop "${values.title}" created successfully!`,
        );
        form.reset();
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(
          result?.error?.message ||
            (mode === "edit"
              ? "Failed to update workshop."
              : "Failed to create workshop."),
        );
      }
    } catch (error) {
      console.error("Error creating workshop:", error);
      toast.error(
        mode === "edit"
          ? "Failed to update workshop. Please try again."
          : "Failed to create workshop. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!openProp && mode === "create" && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workshop
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Workshop" : "Create New Workshop"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update workshop details and save changes."
              : "Add a new workshop to the platform. Fill in the details below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workshop Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Advanced React Patterns"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the workshop, topics covered, and learning outcomes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Room */}
            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                    disabled={roomsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            roomsLoading ? "Loading rooms..." : "Select a room"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={String(room.id)}>
                          {room.name
                            ? `${room.name} (ID: ${room.id})`
                            : `Room ${room.id}`}
                          {room.capacity ? ` - ${room.capacity} seats` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose a room from the backend room list.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Time and End Time */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Slots and Fee */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_slots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Slots</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of participants
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fee ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave as 0 for free workshops
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? mode === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : mode === "edit"
                    ? "Save Changes"
                    : "Create Workshop"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
