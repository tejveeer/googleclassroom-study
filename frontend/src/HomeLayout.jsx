import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Outlet } from "react-router";
import { useClickAway } from "react-use";
import { toCamel } from "./utility";

export function HomeLayout() {
  const { isPending, error, data } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchUserCourses
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onClose = () => setIsSidebarOpen(false);
  return (
    <div className="min-h-screen bg-pink-300 flex flex-col select-none">
      <Header setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={onClose} />
        <div className="flex-1 bg-gray-100">
          <div className="bg-white h-full p-6 rounded-tl-4xl">
            <Outlet context={toCamel(data)} />
          </div>
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
        <button 
          className="hamburger-menu size-10 rounded-lg transition duration-200 ease-in hover:bg-amber-400 cursor-pointer bg-amber-300"
          onClick={() => setIsSidebarOpen(prev => !prev)}
        >
        </button>
        <h1 className="text-2xl">Classroom</h1>
      </div>
      {/* Right side */}
      <div className="flex gap-4 items-center">
        <div className="add-button relative">
          <button
            className="
              text-3xl bg-gray-300 px-2 rounded-md 
              cursor-pointer hover:bg-gray-400 transition 
              duration-200 ease-in"
            onClick={() => setIsDropdownSelected(prev => !prev)}
          >+</button>
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
    <div ref={ref} className="absolute rounded-lg size-32 right-4 top-4 flex flex-col flex-1 gap-1 p-2 bg-gray-300">
      <button 
        className="flex-1 hover:bg-gray-400 cursor-pointer rounded-md transition duration-100 ease-in"
        onClick={onClickJoinCourse}
      >Join</button>
      <button 
        className="flex-1 hover:bg-gray-400 cursor-pointer rounded-md transition duration-100 ease-in" 
        onClick={onClickCreate}>Create</button>
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
  } = useForm({ mode: "onSubmit" });

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
        className="fixed top-0 left-0 flex justify-center items-center min-h-screen w-full bg-black/20"
        onClick={() => setIsCreateCourseModalSelected(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-72 h-72 bg-gray-400 rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h1>Course Name</h1>
            <input {...register("courseName", courseFormRules.courseName)} />
            {errors.courseName && <p>{errors.courseName.message}</p>}
          </div>

          <div>
            <h1>Course Room</h1>
            <input {...register("courseRoom", courseFormRules.courseRoom)} />
            {errors.courseRoom && <p>{errors.courseRoom.message}</p>}
          </div>

          <div>
            <h1>Banner color</h1>
            <input {...register("bannerColor", courseFormRules.bannerColor)} />
            {errors.bannerColor && <p>{errors.bannerColor.message}</p>}
          </div>

          <input type="submit" value="Submit" />
          <p>{errors.root && errors.root.message}</p>
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
    setError
  } = useForm({ mode: "onSubmit" });

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
  const onSubmit = (data) => joinCourseMutation.mutate({ ...data, role: 'student' });

  return (
    <>
      <div
        className="fixed top-0 left-0 flex justify-center items-center min-h-screen w-full bg-black/20"
        onClick={() => setIsJoinCourseModalSelected(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-72 h-72 bg-gray-400 rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h1>Course Code</h1>
            <input {...register("joinId", joinCourseFormRules.joinId)} />
            {errors.joinId && <p>{errors.joinId.message}</p>}
          </div>
          <input type="submit" value="Submit" />
          <p>{errors.root && errors.root.message}</p>
        </form>
      </div>
    </>
  );
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/40 transition-opacity duration-200 lg:hidden
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      <aside
        className={`
          fixed z-10 inset-0 min-h-screen bg-gray-100
          transition-transform duration-200 ease-in-out w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static lg:translate-x-0 lg:min-h-[calc(100vh-64px)] lg:bg-purple-300 lg:w-18
          lg:transition-[width]
          ${isOpen ? 'lg:w-64' : ''}

          flex flex-col gap-4 items-center
          p-4
        `}
      >
        <div className="mt-5 self-stretch flex items-center gap-2">
          <div className="home size-10 bg-amber-400 rounded-md"></div>
          <p className="text-center self-stretch">Home</p>
        </div>
      </aside>
    </>
  );
}

async function fetchUserCourses() {
  const res = await fetch('http://localhost:3000/api/courses/', {
    credentials: "include"
  });

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
  const res = await fetch("http://localhost:3000/api/courses/", {
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