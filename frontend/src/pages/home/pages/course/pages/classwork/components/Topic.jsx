import { Assignment } from "./Assignment";

export function Topic({ topicObject, assignments }) {
  return <>
    <div className="flex flex-col">
      {topicObject !== null && <div className="text-2xl text-gray-700 pb-4 border-b border-gray-300">
        {topicObject.topic}
      </div>}
      {assignments && assignments.map(assignmentObject => 
        <Assignment
          key={assignmentObject.id} 
          assignmentObject={assignmentObject} 
        />
      )}
    </div>
  </>;
}