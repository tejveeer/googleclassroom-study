import { toCamel } from "@/utility";
import { useQuery } from "@tanstack/react-query";
import { fetchUserCourses, getUser } from "./client";

export function useUser() {
  const { isSuccess, data } = useQuery({
    queryKey: ["me"],
    queryFn: getUser,
  });

  const userData = isSuccess ? toCamel(data).user : undefined;
  return userData;
}

export function useCourses() {
  const { isSuccess, data } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchUserCourses
  });

  const courses = isSuccess ? data.map(it => toCamel(it)) : undefined;
  return courses;
}