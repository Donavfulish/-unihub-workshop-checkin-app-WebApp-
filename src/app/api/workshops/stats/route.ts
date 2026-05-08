import { NextResponse } from "next/server";
import { mockWorkshops } from "@/lib/mock-data";

export async function GET() {
  try {
    const ongoing = mockWorkshops
      .filter((w) => w.registered > 0)
      .map((w) => ({
        id: Number(w.id),
        title: w.title,
        registered: w.registered,
        total_slots: w.capacity,
      }));

    const total_registrations = mockWorkshops.reduce(
      (sum, w) => sum + (w.registered || 0),
      0,
    );

    return NextResponse.json({
      data: { ongoing_workshops: ongoing, total_registrations },
    });
  } catch (error) {
    console.error("Error building workshop stats", error);
    return NextResponse.json(
      { data: null, error: { message: "Failed to compute stats" } },
      { status: 500 },
    );
  }
}
