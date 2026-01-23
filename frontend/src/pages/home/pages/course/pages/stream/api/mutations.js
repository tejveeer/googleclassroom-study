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

export function useUpdatePost(postId, onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => updatePost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      onSuccess?.();
    },
    onError: (err) => {
      onError?.(err);
    },
  });
}

export function useDeletePost(courseId, onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", courseId] });
      onSuccess?.();
    },
    onError: (err) => {
      onError?.(err);
    },
  });
}

export function useAddComment(postId, onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content) => addPostComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      onSuccess?.();
    },
    onError: (err) => {
      onError?.(err);
    },
  });
}

export function useDeleteComment(postId, onSuccess, onError) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId) => deleteCommment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      onSuccess?.();
    },
    onError: (err) => {
      onError?.(err);
    },
  });
}
