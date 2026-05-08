export interface Workshop {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  room_id?: number | null;
  image: string;
  aiSummary: string;
  syllabus: string;
  tags: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  registeredWorkshops: string[];
}

export interface Registration {
  id: string;
  studentId: string;
  workshopId: string;
  registeredAt: string;
  status: "active" | "completed" | "cancelled";
}

export interface DashboardStats {
  totalRegistrations: number;
  activeWorkshops: number;
  totalRevenue: number;
  upcomingWorkshops: number;
}
