// classwork/mutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  deleteAssignment,
  createTopic,
  deleteTopic,
} from "./client";

// ----------------------------
// Assignments
// ----------------------------
export function useCreateAssignment({ courseId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createAssignment(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

export function useDeleteAssignment({ courseId, assignmentId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAssignment(courseId, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

// ----------------------------
// Topics
// ----------------------------
export function useCreateTopic({ courseId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createTopic(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}


/**
 * Fallback: hits your current backend route DELETE /courses/:courseId/topics/
 * Only use if that's intentionally "delete all topics" or "clear topics".
 */
export function useDeleteTopic({ courseId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => deleteTopic(courseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topics", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}
