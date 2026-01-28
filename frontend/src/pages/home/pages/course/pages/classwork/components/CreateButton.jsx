import { Dropdown } from "@/components/Dropdown";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

export function CreateButton({ setShowCreateTopicModal, setShowCreateAssignmentPage }) {
  const ref = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const onClickCreateAssignment = () => {
    console.log("CreateButton assignment create");
    setShowCreateAssignmentPage(true);
  };
  const onClickCreateTopic = () => {
    setShowCreateTopicModal(true);
  };

  return <>
    <div className="relative w-min">
      <div 
          className="
            rounded-full py-2 px-5
            flex gap-2 cursor-pointer 
            text-white bg-blue-700 hover:bg-blue-800 
            hover:shadow transition duration-100 ease-in
          "
          ref={ref}
          onClick={() => setShowDropdown(prev => !prev)}
      >
        <Plus className="-translate-x-1"/>
        <h1 className="-translate-x-1">Create</h1>
      </div>
      {showDropdown && <Dropdown 
        dropdownTriggerButtonRef={ref}
        dropdownButtonObject={{
          "Create Assignment": onClickCreateAssignment,
          "Create Topic": onClickCreateTopic,
        }}
        showDropdown={setShowDropdown}
        className={"z-30"}
      />}
    </div>
  </>
}