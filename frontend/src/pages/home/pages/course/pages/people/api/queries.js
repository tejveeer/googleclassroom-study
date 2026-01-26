// people/queries.js
import { useQuery } from "@tanstack/react-query";
import { getTeachers, getStudents } from "./client";
import { toCamel } from "@/utility";

export function useTeachers({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["teachers", courseId],
    queryFn: ({ queryKey: [_, courseId] }) => getTeachers(courseId),
    enabled: !!courseId,
  });

  const teachers = isSuccess ? toCamel(data) : undefined;
  return { teachers, isSuccess, ...rest };
}

export function useStudents({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["students", courseId],
    queryFn: ({ queryKey: [_, courseId] }) => getStudents(courseId),
    enabled: !!courseId,
  });

  const students = isSuccess ? toCamel(data) : undefined;
  return { students, isSuccess, ...rest };
}
