export async function deleteCourse({ courseId }) {
  const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/courses/${courseId}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle non-2xx responses explicitly
  if (!res.ok) {
    let message = "Request failed";

    try {
      const body = await res.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  return null;
}
