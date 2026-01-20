export async function getUser() {
  const res = await fetch("http://localhost:3000/api/auth/me", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

export async function fetchUserCourses() {
  const res = await fetch('http://localhost:3000/api/courses/', {
    credentials: "include"
  });


  console.log("Request made");

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

  return await res.json();
}

export async function createCourse(courseData) {
  const res = await fetch("http://localhost:3000/api/courses/create", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
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

  // 201 Created → body contains course data
  return res.json();
}

export async function joinCourse(joinCourseData) {
  const res = await fetch("http://localhost:3000/api/courses/join", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(joinCourseData),
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

  // 201 Created → body contains course data
  return res.json();
}