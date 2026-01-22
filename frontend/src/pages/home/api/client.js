import { api } from "@/utility";

export const getUser = () => api.get("/auth/me");

export const fetchUserCourses = () => api.get("/courses/");

export const createCourse = (courseData) =>
  api.post("/courses/create", courseData);

export const joinCourse = (joinCourseData) =>
  api.post("/courses/join", joinCourseData);
