import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      console.log("Triggered on success");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error) => {
      console.error(error);
    }
  });

  return <>
    <div className="flex flex-col md:flex-row gap-4">
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
  const [isDeleteDropdownSelected, setIsDeleteDropdownSelected] = useState(false);
  const onClickDelete = () => deleteCourseMutation.mutate({ courseId: courseData.id });

  return <>
    <article className="size-30 p-2 border border-black flex flex-col">
      <header>
        <h1>{courseData.courseName}</h1>
        <p>{courseData.courseRoom}</p>
      </header>
      <footer className="flex-1 flex flex-col-reverse">
        {courseData.userRole === 'teacher' && 
        <div className="flex flex-row-reverse">
          <div 
            className="relative delete-course size-4 bg-black"
            onClick={setIsDeleteDropdownSelected}
          >
            {isDeleteDropdownSelected && <DeleteCourseDropdown 
              setIsDropdownSelected={setIsDeleteDropdownSelected}
              onClickDelete={onClickDelete}
            />}
          </div>
        </div>}
      </footer>
    </article>
  </>;
}

function DeleteCourseDropdown({ setIsDeleteDropdownSelected, onClickDelete }) {
  const ref = useRef(null);
  useClickAway(ref, () => setIsDeleteDropdownSelected(false));

  return <>
    <div ref={ref} className="absolute rounded-lg size-32 right-4 top-4 flex flex-col flex-1 gap-1 p-2 bg-gray-300">
      <button 
        className="flex-1 hover:bg-gray-400 cursor-pointer rounded-md transition duration-100 ease-in"
        onClick={onClickDelete}
      >Delete</button>
    </div>
  </>
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
