export interface WorkshopResponse {
  id: string;
  title: string;
  description?: string;
  instructor?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  registered?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
  price?: number;
  image?: string;
  tags?: string[];
}

export interface WorkshopsListResponse {
  items: WorkshopResponse[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface CreateWorkshopDTO {
  title: string;
  description?: string;
  instructor?: string;
  category?: string;
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  price?: number;
  level?: "Beginner" | "Intermediate" | "Advanced";
  image?: string;
  tags?: string[];
}

export type UpdateWorkshopDTO = Partial<CreateWorkshopDTO>;
