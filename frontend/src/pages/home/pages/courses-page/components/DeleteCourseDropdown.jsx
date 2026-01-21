import { useRef } from "react";
import { useClickAway } from "react-use";

export function DeleteCourseDropdown({ kebabRef, setIsDropdownOpen, onClickDelete }) {
  const dropdownRef = useRef(null);

  // Close only when click is outside BOTH the dropdown and the kebab button
  useClickAway(dropdownRef, (event) => {
    const target = event.target;

    // If the click happened on the kebab button (or inside it), ignore.
    if (kebabRef.current && kebabRef.current.contains(target)) return;

    setIsDropdownOpen(false);
  });
  
  return (
    <div
      ref={dropdownRef}
      className="absolute left-56 -bottom-12 z-10 rounded-lg flex flex-col py-2 bg-gray-200 shadow-md"
      onClick={(e) => e.stopPropagation()} // clicking inside shouldn't trigger outside handlers
    >
      <button
        className="hover:bg-gray-400 px-2 py-3 text-left cursor-pointer transition duration-100 ease-in"
        onClick={() => {
          onClickDelete();
          setIsDropdownOpen(false);
        }}
      >
        Delete
      </button>
    </div>
  );
}

