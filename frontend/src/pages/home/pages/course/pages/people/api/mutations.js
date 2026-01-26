// people/mutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCourseMember } from "./client";

export function useRemoveCourseMember({ courseId, memberId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeCourseMember(courseId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers", courseId] });
      queryClient.invalidateQueries({ queryKey: ["students", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}
