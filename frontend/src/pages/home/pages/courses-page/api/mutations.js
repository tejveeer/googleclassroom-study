import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourse } from "./client";

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return deleteCourseMutation;
}