import { Input } from "@/components/Input";
import { ModalBackground } from "@/components/ModalBackground";
import { useState } from "react";
import { useCreateTopic } from "../api/mutations";
import { tw } from "@/utility";

export function CreateTopicModal({ courseId, setShowCreateTopicModal }) {
  const [topic, setTopic] = useState("");
  const createTopicMutation = useCreateTopic({ 
    courseId,
    onSuccess: () => {
      setShowCreateTopicModal(false);
    } 
  });

  const onClickSubmit = () => {
    createTopicMutation.mutate({ topic });
  }

  return <>
    <ModalBackground setModalOpen={setShowCreateTopicModal} >
      <div className="p-6 bg-gray-100 w-108 rounded-2xl">
        <h1 className="text-gray-700 mb-1 text-2xl">Add Topic</h1>
        <p className="text-md text-gray-400 mb-4">Topics help organize classwork into modules or units.</p>
        <Input placeholder="Topic" labelBg="bg-gray-100" onChange={(e) => setTopic(e.target.value)} />
        <div className="mt-3 flex flex-row-reverse">
          <div 
            className={tw(
              "px-3 py-1 transition duration-100 ease-in rounded-full",
              topic ? "text-blue-700 hover:bg-blue-100 cursor-pointer" : "text-gray-500 cursor-default"
            )} 
            onClick={onClickSubmit}
          >
            Submit
          </div>
        </div>
      </div>
    </ModalBackground>
  </>
}