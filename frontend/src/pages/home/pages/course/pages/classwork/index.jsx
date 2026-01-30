import { useOutletContext, useParams } from "react-router"
import { CreateButton } from "./components/CreateButton";
import { Select } from "@/components/Select";
import { useState } from "react";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { useAssignments, useTopics } from "./api/queries";
import { CreateAssignmentPage } from "./components/CreateAssignmentPage";
import { Topic } from "./components/Topic";

export function ClassworkPage() {
  const { courseId } = useParams();
  const { course: { userRole } } = useOutletContext();
  const [selectedValue, setSelectedValue] = useState("all");

  const [showCreateTopicModel, setShowCreateTopicModal] = useState(false);
  const [showCreateAssignmentPage, setShowCreateAssignmentPage] = useState(false);

  const { topics } = useTopics({ courseId });
  const { assignments } = useAssignments({ courseId });

  console.log("topics assignments", topics, assignments);

  const getAssignmentsByTopicId = (topicId) => {
    return assignments.filter(assignment => assignment.topicId === topicId);
  };

  const getAssignmentsWithoutTopic = () => {
    return assignments.filter(assignment => assignment.topicId === null);
  };

  const isUserTeacher = userRole === "teacher";
  return <>
    <div className="p-6 h-full">
      <div className="mx-auto h-full max-w-180 flex flex-col gap-5">
        {isUserTeacher && 
          <CreateButton 
            setShowCreateTopicModal={setShowCreateTopicModal} 
            setShowCreateAssignmentPage={setShowCreateAssignmentPage} 
          />
        }
        <div className="w-62">
          <Select 
            options={[
              { value: "all", label: "All Topics" },
              ...topics?.map(tobj => ({ "value": tobj.topic, "label": tobj.topic }))
            ]}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Topic"
            type="labeled"
            className="py-3"
          />
        </div>
        <Topic key="unassigned" topicObject={null} assignments={getAssignmentsWithoutTopic()} />  
        {topics && topics.map((topicObject) => 
          <Topic 
            key={topicObject.id} 
            topicObject={topicObject} 
            assignments={getAssignmentsByTopicId(topicObject.id)}
          />
        )}
      </div>
      {showCreateTopicModel && 
        <CreateTopicModal 
          courseId={courseId} 
          setShowCreateTopicModal={setShowCreateTopicModal} 
        />
      }
      {showCreateAssignmentPage &&
        <CreateAssignmentPage 
          courseId={courseId}
          setShowCreateAssignmentPage={setShowCreateAssignmentPage}
          topics={topics}
        />
      }
    </div>
  </> 
}