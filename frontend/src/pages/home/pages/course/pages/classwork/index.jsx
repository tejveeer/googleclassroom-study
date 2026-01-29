import { useOutletContext, useParams } from "react-router"
import { CreateButton } from "./components/CreateButton";
import { Select } from "@/components/Select";
import { useState } from "react";
import { CreateTopicModal } from "./components/CreateTopicModal";
import { useTopics } from "./api/queries";
import { CreateAssignmentPage } from "./components/CreateAssignmentPage";

export function ClassworkPage() {
  const { courseId } = useParams();
  const { course: { userRole } } = useOutletContext();
  const [selectedValue, setSelectedValue] = useState("all");

  const [showCreateTopicModel, setShowCreateTopicModal] = useState(false);
  const [showCreateAssignmentPage, setShowCreateAssignmentPage] = useState(false);

  const { topics } = useTopics({ courseId });
  const topicsArray = topics?.map(topicObject => topicObject.topic) ?? [];

  console.log(topicsArray);
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
              ...topicsArray?.map(topic => ({ "value": topic, "label": topic }))
            ]}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder="Topic"
            type="labeled"
            className="py-3"
          />
        </div>
        {topics && topics.map(({ topic }, idx) => 
          <div key={idx} className="text-2xl text-gray-700 pb-4 border-b border-gray-300">
            {topic}
          </div>
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
          topics={topicsArray}
        />
      }
    </div>
  </> 
}