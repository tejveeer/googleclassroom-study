import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { useCourses, useUser } from "./api/queries";

export function HomeLayout() {
  const { userData } = useUser();
  const courses = useCourses();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const onClose = () => setIsSidebarOpen(false);
  return (
    <div className="min-h-screen bg-pink-300 flex flex-col select-none">
      <Header userData={userData} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={onClose} courses={courses} />
        <div className="flex-1 bg-gray-100 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="bg-white min-h-full rounded-tl-4xl flex flex-col">
            {courses && <Outlet context={courses} />}
          </div>
        </div>
      </div>
    </div>
  );
}
