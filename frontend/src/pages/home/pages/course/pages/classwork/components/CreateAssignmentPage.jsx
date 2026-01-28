import { Input } from "@/components/Input";
import { tw } from "@/utility";
import { Clipboard, X } from "lucide-react";
import { useState } from "react";

export function CreateAssignmentPage({ courseId, setShowCreateAssignmentPage }) {
  const [assignment, setAssignment] = useState({
    assignmentTitle: "",
    assignmentInstructions: ""
  });

  const changeAssignment = (patch) => {
    setAssignment(prev => ({
      ...prev,
      ...patch,
    }));
  }  

  return <>
    <div className="fixed top-0 z-100 left-0 bg-white min-h-screen w-full flex flex-col">
      <Header assignmentTitle={assignment.assignmentTitle} />
      <Body changeAssignment={changeAssignment} />
    </div>
  </>;
}

function Header({ assignmentTitle }) {
  return <>
    <header className="p-3 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className="
          flex justify-center items-center 
          rounded-full size-9 hover:bg-gray-200 cursor-pointer
          transition duration-100 ease-in"
        >
          <X />
        </div>
        <div className="bg-pink-300 text-pink-500 flex justify-center items-center rounded-full size-9">
          <Clipboard />
        </div>
        <h1 className="text-2xl text-gray-500">Assignment</h1>
      </div>
      <div 
        className={tw(
          "py-2 px-5 rounded-full transition duration-100 ease-in",
          assignmentTitle 
            ? "bg-blue-700 text-white hover:bg-blue-700/80 hover:shadow cursor-pointer" 
            : "bg-gray-300 text-gray-400 cursor-default"
        )}
      >
        Assign
      </div>
    </header>
  </>
}

function Body({ changeAssignment }) {
  return <>
    <div className="flex flex-col flex-1">
      <AssignmentContent changeAssignment={changeAssignment} />
      <AssignmentSettings changeAssignment={changeAssignment} />
    </div>
  </>
}

function AssignmentContent({ changeAssignment }) {
  const changeAssignmentTitle = (e) => {
    changeAssignment({
      assignmentTitle: e.target.value
    });
  }

  return <>
    <div className="p-5">
      <div className="border border-gray-200 rounded-md p-3">
        <Input
          type="secondary"
          placeholder="Title"
          onChange={changeAssignmentTitle}
          labelPosition="left-3.5"
        />
        <Input 
          type="tertiary"
          placeholder="Instructions"
          className="mt-4"
          labelBg="bg-gray-75"
        />
      </div>
    </div>
  </>
}

function AssignmentSettings() {
  return <></>
}