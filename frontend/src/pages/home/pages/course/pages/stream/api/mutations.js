import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  updatePost,
  deletePost,
  addPostComment,
  deleteCommment,
} from "./client";

export function useCreatePost({ courseId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => createPost(courseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => {
      onError?.(err);
    },
  });
}

export function useUpdatePost({ courseId, postId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

export function useAddComment({ courseId, postId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => addPostComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

export function useDeleteComment({ courseId, commentId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteCommment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

