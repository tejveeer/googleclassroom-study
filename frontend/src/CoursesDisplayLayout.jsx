import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import { useOutletContext } from "react-router";
import { useClickAway } from "react-use";

// coursesData: [{ id, courseName, courseRoom, joinId, memberId, userRole, joinedAt }]
export function CoursesDisplayLayout() {
  const courses = useOutletContext();

  const queryClient = useQueryClient();
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  if (!courses) {
    return <p>No courses available yet...</p>
  }
  return <>
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
      {courses.map((courseData) => 
        <Course 
          key={courseData.id} 
          courseData={courseData}
          deleteCourseMutation={deleteCourseMutation} 
        />)}
    </div>
  </>;
}

function Course({ courseData, deleteCourseMutation }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const kebabRef = useRef(null);

  const onClickDelete = () => deleteCourseMutation.mutate({ courseId: courseData.id });

  // Close only when click is outside BOTH the dropdown and the kebab button
  useClickAway(dropdownRef, (event) => {
    const target = event.target;

    // If the click happened on the kebab button (or inside it), ignore.
    if (kebabRef.current && kebabRef.current.contains(target)) return;

    setIsDropdownOpen(false);
  });

  const onClickKebab = (e) => {
    e.stopPropagation(); // prevents weird parent click handlers
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <article className="size-66 cursor-pointer hover:shadow-md shadow-gray-200 transition duration-200 ease-in border overflow-hidden border-gray-300 rounded-xl flex flex-col">
        <header className="bg-green-400 p-4">
          <h1 className="text-2xl text-white">{courseData.courseName}</h1>
          <p>{courseData.courseRoom}</p>
        </header>

        <footer className="flex-1 flex flex-col-reverse">
          {courseData.userRole === "teacher" && (
            <div className="flex flex-row-reverse border-t border-gray-300 p-2">
              <button
                ref={kebabRef}
                type="button"
                onClick={onClickKebab}
                className="cursor-pointer rounded-full hover:bg-gray-200 transition duration-200 ease-in"
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
              >
                <MoreVertical className="size-7 p-1" />
              </button>
            </div>
          )}
        </footer>
      </article>

      {isDropdownOpen && (
        <DeleteCourseDropdown
          dropdownRef={dropdownRef}
          onClickDelete={onClickDelete}
          onClose={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}

function DeleteCourseDropdown({ dropdownRef, onClickDelete, onClose }) {
  return (
    <div
      ref={dropdownRef}
      className="absolute left-56 -bottom-12 z-10 rounded-lg flex flex-col py-2 bg-gray-200 shadow-md"
      onClick={(e) => e.stopPropagation()} // clicking inside shouldn't trigger outside handlers
    >
      <button
        className="hover:bg-gray-400 px-2 py-3 text-left cursor-pointer transition duration-100 ease-in"
        onClick={() => {
          onClickDelete();
          onClose(); // optional: close menu after delete click
        }}
      >
        Delete
      </button>
    </div>
  );
}

async function deleteCourse({ courseId }) {
  const res = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
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
