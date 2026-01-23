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
    mutationFn: (content) => updatePost(postId, courseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

export function useDeletePost({ courseId, postId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePost(postId, courseId),
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
    mutationFn: (content) => addPostComment(postId, courseId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

export function useDeleteComment({ commentId, courseId, postId, onSuccess, onError }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCommment(commentId, courseId, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => onError?.(err),
  });
}

