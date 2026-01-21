import { Input } from "@/components/Input";
import { ModalBackground } from "@/components/ModalBackground";
import { useState } from "react";

export function NewPostModal({ setPostModalOpen }) {
  const [content, setContent] = useState("");

  return <>
    <ModalBackground setModalOpen={setPostModalOpen}>
      <div className="min-w-md z-100 min-h-118 bg-gray-100 rounded-4xl flex flex-col">
        <h1 className="text-2xl p-6 text-gray-800 border-b border-gray-300">Announcement</h1>
        <div className="p-6">
          <Input
            type="tertiary"
            placeholder="Announce something to your class"
            className="text-wrap"
          />
        </div>
      </div>
    </ModalBackground>
  </>
}