
// Dropdown trigger button
// Dropdown: button1, ..., buttonN

import { tw } from "@/utility";
import { useRef } from "react";
import { useClickAway } from "react-use";

export function Dropdown({ dropdownTriggerButtonRef, dropdownButtonObject, className, showDropdown }) {
  /*
    dropdownTriggerButtonRef: the button that initially opens the dropdown
    dropdownButtonObject: { buttonName: onClickButton, ... }
    showDropdown: the state function that shows or hides dropdown
  */

  const dropdownRef = useRef(null);

  // Close dropdown only if click is outside both the trigger button AND the dropdown
  useClickAway(dropdownRef, (event) => {
    const target = event.target;

    // If the click happened on the kebab button (or inside it), ignore.
    if (dropdownTriggerButtonRef.current && dropdownTriggerButtonRef.current.contains(target)) return;

    showDropdown(false);
  });

  return <>
    <div 
      ref={dropdownRef} 
      className={
        tw(
          className || "right-4 top-4",
          "absolute z-10 rounded-lg flex flex-col py-2 flex-1 bg-gray-200 shadow-md", 
        )
      }
    >
      {Object
        .entries(dropdownButtonObject)
        .map(
          ([buttonName, onClickButton], idx) => 
            <button
              key={idx}
              className="hover:bg-gray-300 px-2 py-3 text-left text-nowrap cursor-pointer transition duration-100 ease-in"
              onClick={() => { onClickButton(); showDropdown(false); }}
            >{buttonName}</button>
        )
      }
    </div>
  </>
}