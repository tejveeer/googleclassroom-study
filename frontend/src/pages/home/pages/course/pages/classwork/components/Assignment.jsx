import { timeAgo, tw } from "@/utility";
import { Clipboard } from "lucide-react";
import { useState } from "react";

export function Assignment({ assignmentObject }) {
  const [isAssignmentClicked, setIsAssignmentClicked] = useState(false);
  const onClickAssignment = () => {
    setIsAssignmentClicked(prev => !prev);
  };

  const assignmentCreationDate = timeAgo(assignmentObject.createdAt);

  return <>
    <div 
      className={tw(
        "flex flex-col border-b transition-all duration-150 border-gray-300 ease-in",
        !isAssignmentClicked ? "hover:bg-gray-200 hover:shadow" : "py-2 border-none"
      )}
    >
      <div 
        className={tw(
          "flex items-center py-3 gap-3 px-4 border-gray-400 cursor-pointer rounded-t-lg transition duration ease-in-out",
          isAssignmentClicked ? "bg-blue-100 hover:bg-gray-200 border-b" : ""
        )}
        onClick={onClickAssignment}
      >
        <div className="bg-pink-300 text-pink-500 flex justify-center items-center rounded-full size-9">
          <Clipboard />
        </div>
        <span className="text-2xl flex-1 text-gray-700">{assignmentObject.assignmentName}</span>
        <span className="text-1xl text-gray-700">Created {assignmentCreationDate}</span>
      </div>
      
      {/* Grid container with grid-rows transition */}
      <div className={tw(
        "grid transition-all duration-300 ease-in-out",
        isAssignmentClicked ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}>
        {/* Overflow hidden wrapper */}
        <div className="overflow-hidden rounded-b-lg">
          {/* Actual content with opacity transition */}
          <div className={tw(
            "px-4 py-2 bg-blue-100 transition-opacity duration-300",
            isAssignmentClicked ? "opacity-100" : "opacity-0"
          )}>
            View Assignment
          </div>
        </div>
      </div>
    </div>
  </>;
}