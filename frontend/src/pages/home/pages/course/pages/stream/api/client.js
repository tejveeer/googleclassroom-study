import { api } from "@/utility";

// Queries
export const getPosts =
  (courseId) => api.get(`/posts/${courseId}/`);

// Mutations
export const createPost = 
  (courseId, content) => api.post(`/posts/${courseId}/`, content);
export const updatePost =
  (postId, courseId, content) => api.patch(`/posts/${courseId}/${postId}`, { content });
export const deletePost =
  (postId, courseId) => api.del(`/posts/${courseId}/${postId}`);
export const addPostComment = 
  (postId, courseId, content) => api.post(`/posts/${courseId}/${postId}/comments`, { content });
export const deleteCommment = 
  (commentId, courseId, postId) => api.del(`/posts/${courseId}/${postId}/comments/${commentId}`);