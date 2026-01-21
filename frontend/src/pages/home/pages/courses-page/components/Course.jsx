import { MoreVertical } from "lucide-react";
import { useRef, useState } from "react";
import { DeleteCourseDropdown } from "./DeleteCourseDropdown";
import { useNavigate } from "react-router";
import { Dropdown } from "@/components/Dropdown";

export function Course({ courseData, deleteCourseMutation }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const kebabRef = useRef(null);

  const onClickDelete = () => deleteCourseMutation.mutate({ courseId: courseData.id });

  const onClickKebab = (e) => {
    e.stopPropagation(); // prevents weird parent click handlers
    setIsDropdownOpen((prev) => !prev);
  };

  const onClickCourse = () => {
    navigate(`/courses/${courseData.id}`);
  }

  return (
    <div className="relative">
      <article 
        onClick={onClickCourse}
        className="size-66 cursor-pointer hover:shadow-md shadow-gray-200 transition duration-200 ease-in border overflow-hidden border-gray-300 rounded-xl flex flex-col">
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
        <Dropdown 
          dropdownTriggerButtonRef={kebabRef}
          dropdownButtonObject={{
            "Delete": onClickDelete
          }}
          showDropdown={setIsDropdownOpen}
          className="left-56 -bottom-12"
        />
      )}
    </div>
  );
}
