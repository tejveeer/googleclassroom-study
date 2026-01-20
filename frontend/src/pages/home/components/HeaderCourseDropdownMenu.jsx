import { useRef } from "react";
import { useClickAway } from "react-use";

export function HeaderCourseDropdownMenu({ setIsDropdownSelected, onClickCreate, onClickJoinCourse }) {
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
