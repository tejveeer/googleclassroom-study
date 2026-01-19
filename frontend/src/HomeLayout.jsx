import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Outlet } from "react-router";
import { useClickAway } from "react-use";
import { toCamel, tw } from "./utility";
import { Input } from "./design-system/Input";
import { ChevronUp, Home, Menu, Plus, UserPen } from "lucide-react";

export function HomeLayout() {
  const { isSuccess, data } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchUserCourses
  });

  let courses;
  if (isSuccess) {
    courses = data.map(it => toCamel(it));
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const onClose = () => setIsSidebarOpen(false);
  return (
    <div className="min-h-screen bg-pink-300 flex flex-col select-none">
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={onClose} courses={courses} />
        <div className="flex-1 bg-gray-100">
          {courses && <div className="bg-white h-full p-6 rounded-tl-4xl">
            <Outlet context={courses} />
          </div>}
        </div>
      </div>
    </div>
  );
}

function Header({ setIsSidebarOpen }) {
  const [isDropdownSelected, setIsDropdownSelected] = useState(false);
  const [isCreateCourseModalSelected, setIsCreateCourseModalSelected] = useState(false);
  const [isJoinCourseModalSelected, setIsJoinCourseModalSelected] = useState(false);

  const onClickCreate = () => {
    setIsCreateCourseModalSelected(true);
    setIsDropdownSelected(false);
  }

  const onClickJoinCourse = () => {
    setIsJoinCourseModalSelected(true);
    setIsDropdownSelected(false);
  }

  return (
    <div className="col-span-2 p-4 h-16 flex justify-between items-center bg-gray-100 cursor-default">
      {/* Left side */}
      <div className="flex gap-4 items-center">
        <div 
          className="size-10 flex justify-center items-center hover:bg-gray-200 cursor-pointer transition duration-75 ease-in rounded-full"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
          <Menu className="size-8" />
        </div>
        <img src="/googleclassroom.png" alt="Google Classroom Logo" className="size-10" />
        <h1 className="-ml-1 text-2xl text-gray-700">Classroom</h1>
      </div>
      {/* Right side */}
      <div className="flex gap-4 items-center">
        {/* Add Button */}
        <div className="relative">
          <Plus 
            className="size-10 p-1 rounded-full hover:bg-gray-200 cursor-pointer transition duration-150 ease-in"
            onClick={() => setIsDropdownSelected(prev => !prev)}
          />
          {isDropdownSelected && <CourseAddDropdownMenu 
            setIsDropdownSelected={setIsDropdownSelected}
            onClickCreate={onClickCreate}
            onClickJoinCourse={onClickJoinCourse}
          />}
        </div>
        <div className="profile size-10 rounded-lg transition duration-200 ease-in hover:bg-purple-400 bg-purple-300 cursor-pointer"></div>
      </div>

      {/* Modals */}
      {isCreateCourseModalSelected && 
        <CreateCourseModal setIsCreateCourseModalSelected={setIsCreateCourseModalSelected} />}
      {isJoinCourseModalSelected && 
        <JoinCourseModal setIsJoinCourseModalSelected={setIsJoinCourseModalSelected} />}
    </div>
  );
}

function CourseAddDropdownMenu({ setIsDropdownSelected, onClickCreate, onClickJoinCourse }) {
  const ref = useRef(null);
  useClickAway(ref, () => setIsDropdownSelected(false));

  return <>
    {/* TODO: FIX THIS, clicking button + useClickAway conflict! */}
    <div ref={ref} className="absolute rounded-lg right-4 top-4 flex flex-col py-2 flex-1 bg-gray-200 shadow-md">
      <button 
        className="hover:bg-gray-400 px-2 py-3 text-left cursor-pointer transition duration-100 ease-in"
        onClick={onClickJoinCourse}
      >Join class</button>
      <button 
        className="hover:bg-gray-400 px-2 py-3 text-nowrap cursor-pointer transition duration-100 ease-in" 
        onClick={onClickCreate}
      >Create class</button>
    </div>
  </>
}

const courseFormRules = {
  courseName: {
    required: "Course name is required",
    maxLength: {
      value: 10,
      message: "Course name must be at most 10 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },

  courseRoom: {
    required: "Course room is required",
    maxLength: {
      value: 3,
      message: "Course room must be at most 3 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },

  bannerColor: {
    required: "Banner color is required",
    pattern: {
      value: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      message: "Enter a valid hex color (e.g. #fff or #ffffff)",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },
};

function CreateCourseModal({ setIsCreateCourseModalSelected }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({ mode: "onChange" });

  const queryClient = useQueryClient();
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsCreateCourseModalSelected(false);
    },
    onError: (err) => {
      setError("root", { type: "server", message: err.message });
    },
  })
  const onSubmit = (data) => createCourseMutation.mutate(data);

  return (
    <>
      <div
        className="fixed z-20 top-0 left-0 flex justify-center items-center min-h-screen w-full bg-black/20"
        onClick={() => setIsCreateCourseModalSelected(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200 w-86 p-6 shadow-lg rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-xl mb-4">Create Class</h1>
          <Input 
            type="secondary" 
            placeholder="Couse Name"
            error={errors.courseName} 
            {...register("courseName", courseFormRules.courseName)}
          />
          <p className="h-4 text-sm text-gray-500 mb-2">{errors.courseName && errors.courseName.message}</p>

          <Input 
            type="secondary" 
            placeholder="Course Room"
            error={errors.courseRoom} 
            {...register("courseRoom", courseFormRules.courseRoom)}
          />
          <p className="h-4 text-sm text-gray-500 mb-2">{errors.courseRoom && errors.courseRoom.message}</p>

          <Input 
            type="secondary" 
            placeholder="Banner Color"
            error={errors.bannerColor} 
            {...register("bannerColor", courseFormRules.bannerColor)}
          />
          <p className="h-4 text-sm text-gray-500">{errors.bannerColor && errors.bannerColor.message}</p>

          <p className="h-4 text-sm text-gray-500">{errors.root && errors.root.message}</p>
          <input 
            className="
              text-md self-end text-blue-700 
              cursor-pointer hover:text-blue-800 
              transition duration-75 ease-in 
              hover:bg-blue-200 p-2 rounded-full" 
            type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}

const joinCourseFormRules = {
  joinId: {
    required: "Course code is required",
    maxLength: {
      value: 10,
      message: "Course name must be at most 10 characters",
    },
    setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
  },
};

function JoinCourseModal({ setIsJoinCourseModalSelected }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({ 
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const joinCourseMutation = useMutation({
    mutationFn: joinCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsJoinCourseModalSelected(false);
    },
    onError: (err) => {
      setError("root", { type: "server", message: err.message });
    },
  })
  const onSubmit = (data) => {
    joinCourseMutation.mutate({ ...data, role: 'student' });
  };

  return (
    <>
      <div
        className="fixed z-20 top-0 left-0 flex justify-center items-center min-h-screen w-full bg-black/20"
        onClick={() => setIsJoinCourseModalSelected(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 bg-gray-200 shadow-lg rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">
            <h1 className="text-lg">Course Code</h1>
            <p className="-mt-1 text-md text-gray-500 mb-4">Ask your teacher for the class code, then enter it here</p>
            <Input 
              type="primary"
              placeholder="Course Code"
              error={errors.joinId}
              labelBg="bg-gray-200"
              {...register("joinId", {
                ...joinCourseFormRules.joinId,
                onChange: () => {
                  clearErrors("root");
                }
              })} 
            />
            <p className="h-3 text-sm text-gray-500">
              {errors.root?.message || errors.joinId?.message}
            </p>
          </div>
          <input
            className="text-md self-end text-blue-700 cursor-pointer hover:text-blue-800 transition duration-75 ease-in hover:bg-blue-200 p-2 rounded-full" type="submit" value="Submit" />
        </form>
      </div>
    </>
  );
}

function Sidebar({ isOpen, onClose, courses }) {
  const [showCourses, setShowCourses] = useState(false);
  const [teachingClicked, setTeachingClicked] = useState(false);

  const onClickTeaching = () => {
    setShowCourses(prev => !prev);
    setTeachingClicked(prev => !prev);
  }
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
        <div className="mt-5 cursor-pointer hover:bg-gray-200 transition duration-200 ease-in p-1 rounded-md self-stretch flex items-center">
          <div className="size-8 shrink-0 flex justify-center items-center">
            <Home className="flex flex-col size-8" />
          </div>
          <p className={
            `text-center overflow-hidden transition-opacity duration-200 ease-out ml-4
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
                "size-10 flex justify-center items-center transition duration-150 ease-in", 
                teachingClicked ? "rotate-180" : "",
                isOpen ? 'opacity-100' : 'opacity-0 w-0'
              )}>
              <ChevronUp className="size-8" />
            </div>
          </div>
          {isOpen && showCourses && <div className="mt-2 flex flex-col gap-1">
            {courses && courses.map(course => <CourseNavButton key={course.id} course={course} />)}
          </div>}
        </div>
      </aside>
    </>
  );
}

function CourseNavButton({ course }) {
  return <>
    <div className="flex items-center cursor-pointer hover:bg-green-100 transition duration-150 ease-in rounded-full p-1">
      <div className="size-8 rounded-full bg-green-400 flex items-center justify-center text-xl text-green-700">{course.courseName[0]}</div>
      <div className="ml-4 flex-1 flex flex-col">
        <p className="text-lg">{course.courseName}</p>
        <p className="text-xs">{course.courseRoom}</p>
      </div>
    </div>
  </>
}

async function fetchUserCourses() {
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

async function createCourse(courseData) {
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

async function joinCourse(joinCourseData) {
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