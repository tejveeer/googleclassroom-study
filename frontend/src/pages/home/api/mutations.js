import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse, joinCourse } from "./client";

export function useCreateCourse(onSuccess, onError) {
  const queryClient = useQueryClient();
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onSuccess();
    },
    onError: (err) => {
      onError(err);
    },
  })

  return createCourseMutation;
}

export function useJoinCourse(onSuccess, onError) {
  const queryClient = useQueryClient();
  const joinCourseMutation = useMutation({
    mutationFn: joinCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      onSuccess();
    },
    onError: (err) => {
      onError(err);
    },
  });

  return joinCourseMutation;
}