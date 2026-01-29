import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { tw } from "@/utility";
import { Clipboard, X } from "lucide-react";
import { useState } from "react";
import { useCreateAssignment } from "../api/mutations";

export function CreateAssignmentPage({ courseId, topics, setShowCreateAssignmentPage }) {
  const createAssignmentMutation = useCreateAssignment({ 
    courseId,
    onSuccess: () => {
      setShowCreateAssignmentPage(false);
    } 
  });

  const oneWeekFromToday = new Date();
  oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
  const formattedDate = oneWeekFromToday.toISOString().split('T')[0];
  
  const [assignment, setAssignment] = useState({
    assignmentTitle: "",
    assignmentInstructions: "",
    totalMarks: 100,
    dueDate: formattedDate,
    topic: ""
  });

  const changeAssignment = (patch) => {
    setAssignment(prev => ({
      ...prev,
      ...patch,
    }));
  }; 

  const onClickX = () => {
    setShowCreateAssignmentPage(false);
  };

  const onClickAssign = () => {
    createAssignmentMutation.mutate({
      assignmentName: assignment.assignmentTitle,
      instructions: assignment.assignmentInstructions,
      totalMarks: assignment.totalMarks,
      dueDate: assignment.dueDate
    });
  };

  return <>
    <div className="fixed top-0 z-100 left-0 bg-white min-h-screen w-full flex flex-col">
      <Header onClickX={onClickX} onClickAssign={onClickAssign} assignmentTitle={assignment.assignmentTitle} />
      <Body topics={topics} assignment={assignment} changeAssignment={changeAssignment} />
    </div>
  </>;
}

function Header({ assignmentTitle, onClickX, onClickAssign }) {
  return <>
    <header className="p-3 flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div 
          className="
            flex justify-center items-center 
            rounded-full size-9 hover:bg-gray-200 cursor-pointer
            transition duration-100 ease-in"
          onClick={onClickX}
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
        onClick={onClickAssign}
      >
        Assign
      </div>
    </header>
  </>
}

function Body({ topics, assignment, changeAssignment }) {
  return <>
    <div className="flex flex-col flex-1 sm:flex-row">
      <AssignmentContent changeAssignment={changeAssignment} />
      <AssignmentSettings topics={topics} assignment={assignment} changeAssignment={changeAssignment} />
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
    <div className="p-5 border-b border-gray-300 sm:border-b-0 sm:flex-1 sm:bg-gray-100/75 sm:border-r">
      <div className="mx-auto max-w-4xl">
        <div className="border border-gray-200 sm:bg-white rounded-md p-3">
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
    </div>
  </>
}

function AssignmentSettings({ topics, assignment, changeAssignment }) {
  const onChangeTotalMarks = (e) => {
    changeAssignment({
      totalMarks: e.target.value
    })
  };
  
  const onChangeDueDate = (e) => {
    changeAssignment({
      dueDate: e.target.value
    })
  };
  
  const onChangeTopic = (topic) => {
    changeAssignment({
      topic
    })
  };
  
  return <>
    <div className="p-5 flex flex-col sm:w-52 md:w-92">
      {/* Total Marks */}
      <span className="text-gray-400 text-md mb-1 font-medium">Total Marks</span>
      <Input className="w-60 mb-5 sm:w-full" value={assignment.totalMarks} onChange={onChangeTotalMarks}/>
      {/* Due Date */}
      <span className="text-gray-400 text-md font-medium">Due Date</span>
      <Input className="w-full mb-5" value={assignment.dueDate} onChange={onChangeDueDate} />
      {/* Topic */}
      <span className="text-gray-400 text-md font-medium">Topic</span>
      <Select 
        className="w-full px-3" 
        value={assignment.topic}
        onChange={onChangeTopic}
        options={[
          ...topics?.map(topic => ({ value: topic, label: topic }))
        ]}
      />
    </div>
  </>
}