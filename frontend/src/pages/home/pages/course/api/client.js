import { api } from "@/utility";

export const getUserMemberId =
  ({ queryKey: [_, courseId] }) => api.get(`/auth/me/${courseId}/`);
