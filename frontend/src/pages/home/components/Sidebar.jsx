import { tw } from "@/utility";
import { ChevronUp, Home, UserPen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function Sidebar({ isOpen, onClose, courses }) {
  const [showCourses, setShowCourses] = useState(false);
  const [teachingClicked, setTeachingClicked] = useState(false);
  const navigate = useNavigate();

  const onClickTeaching = () => {
    setShowCourses(prev => !prev);
    setTeachingClicked(prev => !prev);
  }

  const onClickHome = () => {
    navigate('/');
  }

  const onClickCourse = (courseId) => {
    navigate(`/courses/${courseId}`);
  }

  console.log(courses);
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`
          fixed z-10 inset-0 bg-black/40 transition-opacity duration-200 lg:hidden
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      <aside
        className={`
          fixed z-10 inset-0 min-h-screen bg-gray-100
          transition-transform duration-200 ease-in-out w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static lg:translate-x-0 lg:min-h-[calc(100vh-64px)] lg:bg-gray-100 lg:w-18
          lg:transition-[width]
          ${isOpen ? 'lg:w-64' : ''}

          flex flex-col gap-4 items-center
          p-4
        `}
      >
        {/* Home */}
        <div onClick={onClickHome} className="mt-5 cursor-pointer hover:bg-gray-200 transition duration-200 ease-in p-1 rounded-md self-stretch flex items-center">
          <div className="size-8 shrink-0 flex justify-center items-center">
            <Home className="flex flex-col size-8" />
          </div>
          <p className={
            `text-center overflow-hidden transition-opacity duration-200 py-1.5 ease-out ml-4
            text-xl
            ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}
            `
          }>Home</p>
        </div>
        {/* Teaching */}
        <div className="self-stretch">
          <div 
            className="flex items-center hover:bg-gray-200 rounded-md transition duration-200 ease-in cursor-pointer p-1"
            onClick={onClickTeaching}
          >
            <div className="size-8 flex justify-center items-center shrink-0">
              <UserPen className="size-8" />
            </div>
            <p className={
              `flex-1 text-left overflow-hidden transition-opacity duration-200 ease-out ml-4
              text-xl
              ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}
              `
            }>Teaching</p>
            <div className={tw(
                "size-10 flex justify-center items-center transition duration-75 ease-in", 
                teachingClicked ? "rotate-180" : "",
                isOpen ? 'opacity-100' : 'opacity-0 w-0'
              )}>
              <ChevronUp className="size-8" />
            </div>
          </div>
          {isOpen && showCourses && <div className="mt-2 flex flex-col gap-1">
            {courses 
              && courses.map(
                  course => course.userRole === "teacher" ? <CourseNavButton onClick={() => onClickCourse(course.id)} key={course.id} course={course} /> : null)}
          </div>}
        </div>
      </aside>
    </>
  );
}

function CourseNavButton({ onClick, course }) {
  console.log(course);
  return <>
    <div onClick={onClick} className="flex items-center cursor-pointer hover:bg-green-100 transition duration-150 ease-in rounded-full p-1">
      <div className="size-8 rounded-full bg-green-400 flex items-center justify-center text-xl text-green-700">{course.courseName[0]}</div>
      <div className="ml-4 flex-1 flex flex-col">
        <p className="text-lg">{course.courseName}</p>
        <p className="text-xs">{course.courseRoom}</p>
      </div>
    </div>
  </>
}