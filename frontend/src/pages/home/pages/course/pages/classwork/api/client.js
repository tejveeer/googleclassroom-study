// classwork/client.js
import { api } from "@/utility";

// Base: router is mounted at /classwork

// ----------------------------
// Assignments
// ----------------------------
export const listAssignments = (courseId) =>
  api.get(`/classwork/courses/${courseId}/assignments`);

export const createAssignment = (courseId, payload) =>
  api.post(`/classwork/courses/${courseId}/assignments`, payload);

export const deleteAssignment = (courseId, assignmentId) =>
  api.del(`/classwork/courses/${courseId}/assignments/${assignmentId}`);

// ----------------------------
// Topics
// ----------------------------
export const listTopics = (courseId) =>
  api.get(`/classwork/courses/${courseId}/topics`);

export const createTopic = (courseId, payload) =>
  api.post(`/classwork/courses/${courseId}/topics`, payload);


export const deleteTopic = (courseId, payload) =>
  api.del(`/classwork/courses/${courseId}/topic/`, payload);
