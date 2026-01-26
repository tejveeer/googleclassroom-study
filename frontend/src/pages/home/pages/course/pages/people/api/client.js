import { api } from "@/utility";

export const getTeachers = (courseId) => api.get(`/people/teachers/${courseId}`);
export const getStudents = (courseId) => api.get(`/people/students/${courseId}`);
export const removeCourseMember = (courseId, memberId) => {
  console.log("in removeCourseMember with courseId, memberId:", courseId, memberId)
  api.del(`/people/delete/${courseId}/${memberId}`);
}
