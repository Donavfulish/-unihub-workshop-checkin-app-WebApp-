"use server";

import { getFeaturedCourses } from "@/services/course-api.service";

export async function getFeaturedCoursesAction() {
  return getFeaturedCourses();
}
