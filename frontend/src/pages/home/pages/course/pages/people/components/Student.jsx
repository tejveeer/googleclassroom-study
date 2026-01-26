import { MoreVertical } from "lucide-react";
import { useRemoveCourseMember } from "../api/mutations";
import { Dropdown } from "@/components/Dropdown";
import { useRef, useState } from "react";

export function Student({ studentInfo, isUserTeacher, courseId }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const kebabRef = useRef(null);

  const removeStudent = useRemoveCourseMember({ courseId, memberId: studentInfo?.memberId });
  const onClickRemove = () => {
    removeStudent.mutate();
  };

  return <>
    <div className="flex items-center">
      <img 
        src={studentInfo.avatarUrl} 
        alt={studentInfo.name} 
        referrerPolicy="no-referrer" 
        className="size-8 rounded-full" 
      />
      <h1 className="text-md ml-5 text-gray-600">{studentInfo.name}</h1>
      <div className="relative flex-1 flex flex-row-reverse">
        {isUserTeacher && 
          <div 
            ref={kebabRef} 
            className="
              size-8 rounded-full p-1 
              cursor-pointer hover:bg-gray-200 
              transition duration-100 ease-in"
            onClick={() => setShowDropdown(prev => !prev)}  
          >
            <MoreVertical />
          </div>
        }
        {showDropdown && 
          <Dropdown 
            dropdownTriggerButtonRef={kebabRef} 
            dropdownButtonObject={{
              Remove: onClickRemove
            }}
            showDropdown={setShowDropdown}
          />}
      </div>
    </div>
  </>
}