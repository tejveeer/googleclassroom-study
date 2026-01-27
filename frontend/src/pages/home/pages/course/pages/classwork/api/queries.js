// classwork/queries.js
import { useQuery } from "@tanstack/react-query";
import { toCamel } from "@/utility";
import { listAssignments, listTopics } from "./client";

// ----------------------------
// Assignments
// ----------------------------
export function useAssignments({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["assignments", courseId],
    queryFn: ({ queryKey: [_, courseId] }) => listAssignments(courseId),
    enabled: !!courseId,
  });

  const assignments = isSuccess ? toCamel(data) : undefined;
  return { assignments, isSuccess, ...rest };
}

// ----------------------------
// Topics
// ----------------------------
export function useTopics({ courseId }) {
  const { isSuccess, data, ...rest } = useQuery({
    queryKey: ["topics", courseId],
    queryFn: ({ queryKey: [_, courseId] }) => listTopics(courseId),
    enabled: !!courseId,
  });

  const topics = isSuccess ? toCamel(data) : undefined;
  return { topics, isSuccess, ...rest };
}
