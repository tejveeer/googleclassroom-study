import { useRef } from "react";
import { useClickAway } from "react-use";

export function HeaderCourseDropdownMenu({ plusRef, setIsDropdownSelected, onClickCreate, onClickJoinCourse }) {
  const dropdownRef = useRef(null);
  // Close dropdown only if not clicking 
  useClickAway(dropdownRef, (event) => {
    const target = event.target;

    // If the click happened on the kebab button (or inside it), ignore.
    if (plusRef.current && plusRef.current.contains(target)) return;

    setIsDropdownSelected(false);
  });

  return <>
    <div ref={dropdownRef} className="absolute rounded-lg right-4 top-4 flex flex-col py-2 flex-1 bg-gray-200 shadow-md">
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
