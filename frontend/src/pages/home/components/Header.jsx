import { Menu, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { CreateCourseModal } from "./CreateCourseModal";
import { JoinCourseModal } from "./JoinCourseModal";
import { Dropdown } from "@/components/Dropdown";

export function Header({ userData, setIsSidebarOpen }) {
  const [isDropdownSelected, setIsDropdownSelected] = useState(false);
  const [isCreateCourseModalSelected, setIsCreateCourseModalSelected] = useState(false);
  const [isJoinCourseModalSelected, setIsJoinCourseModalSelected] = useState(false);

  const plusRef = useRef(null);

  const onClickCreate = () => {
    setIsCreateCourseModalSelected(true);
  }

  const onClickJoin = () => {
    setIsJoinCourseModalSelected(true);
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
            ref={plusRef} 
            className="size-10 p-1 rounded-full hover:bg-gray-200 cursor-pointer transition duration-150 ease-in"
            onClick={() => setIsDropdownSelected(prev => !prev)}
          />
          {isDropdownSelected && 
            <Dropdown 
              dropdownTriggerButtonRef={plusRef}
              dropdownButtonObject={{
                "Join course": onClickJoin,
                "Create course": onClickCreate
              }}
              showDropdown={setIsDropdownSelected}
              className="right-6 top-6"
            />}
        </div>
        {
          userData?.avatarUrl ?
            <img 
              className="size-11 rounded-full p-1 hover:bg-gray-200 cursor-pointer transition duration-100 ease-in"
              referrerPolicy="no-referrer"
              src={userData.avatarUrl} />
            : <div className="profile size-10 rounded-lg transition duration-200 ease-in hover:bg-purple-400 bg-purple-300 cursor-pointer"></div>
        }
      </div>

      {/* Modals */}
      {isCreateCourseModalSelected && 
        <CreateCourseModal setIsCreateCourseModalSelected={setIsCreateCourseModalSelected} />}
      {isJoinCourseModalSelected && 
        <JoinCourseModal setIsJoinCourseModalSelected={setIsJoinCourseModalSelected} />}
    </div>
  );
}
