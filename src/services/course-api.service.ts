import { apiFetch } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { GetFeaturedCourseResponse } from "@/types/course";

export const COURSE_ROUTES = {
  featured: "api/courses/featured",
} as const;

export async function getFeaturedCourses(): Promise<
  ApiResponse<GetFeaturedCourseResponse[]>
> {
  return apiFetch<ApiResponse<GetFeaturedCourseResponse[]>>(
    COURSE_ROUTES.featured,
    {
      method: "GET",
    },
  );
}
