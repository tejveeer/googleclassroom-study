import { api } from "@/utility";

export const getUser = () => api.get("/api/auth/me");

export const fetchUserCourses = () => api.get("/api/courses/");

export const createCourse = (courseData) =>
  api.post("/api/courses/create", courseData);

export const joinCourse = (joinCourseData) =>
api.post("/api/courses/join", joinCourseData);
