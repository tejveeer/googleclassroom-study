import { api } from "@/utility";

// Queries
export const getPosts =
  (courseId) => api.get(`/posts/${courseId}/`);

// Mutations
export const createPost = 
  (courseId, content) => api.post(`/posts/${courseId}/`, content);
export const updatePost =
  (postId, content) => api.post(`/posts/${postId}`, content);
export const deletePost =
  (postId) => api.del(`/post/${postId}`);
export const addPostComment = 
  (postId, content) => api.post(`/posts/${postId}/comments`, content);
export const deleteCommment = 
  (commentId) => api.del(`/comments/${commentId}`);