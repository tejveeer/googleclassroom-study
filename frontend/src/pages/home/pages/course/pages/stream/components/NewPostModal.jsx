import { Input } from "@/components/Input";
import { ModalBackground } from "@/components/ModalBackground";
import { tw } from "@/utility";
import { useState } from "react";
import { useCreatePost } from "../api/mutations";

export function NewPostModal({ setPostModalOpen, courseId }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const createPostMutation = useCreatePost({ 
    courseId,
    onSuccess: () => {
      console.log("Successfully created post!");
      setPostModalOpen(false);
    },
    onError: (e) => {
      console.error(e);
      setError(e.message);
    }
  });

  const onClickCancelButton = () => {
    setPostModalOpen(false);
  }

  const onClickPostButton = () => {
    createPostMutation.mutate({ content });
  }

  return <>
    <ModalBackground setModalOpen={setPostModalOpen}>
      <div className="min-w-md bg-gray-100 rounded-4xl flex flex-col">
        <h1 className="text-2xl p-6 text-gray-800 border-b border-gray-300">Post</h1>
        <div className="p-6">
          <Input
            type="tertiary"
            placeholder="Announce something to your class"
            error={error}
            className="text-wrap"
            onChange={(e) => setContent(e.target.value)}
            labelBg="bg-gray-50"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex flex-row-reverse mt-5 gap-3">
            <PostContentButton content={content} onClick={onClickPostButton} />
            <CancelButton onClick={onClickCancelButton} />
          </div>
        </div>
      </div>
    </ModalBackground>
  </>
}

function PostContentButton({ content, onClick }) {
  return <>
    <div className={tw(
      "px-10 py-2 text-center rounded-full",
      content ? "bg-blue-700 text-white cursor-pointer hover:shadow-md transition duration-200 ease-out"
              : "bg-gray-200 text-gray-300 cursor-default"
    )}
      onClick={onClick}
    >
      Post
    </div>
  </>
}

function CancelButton({ onClick }) {
  return <>
    <div className="
      bg-transparent px-3 py-2 
      hover:bg-blue-100 text-blue-600 rounded-full
      cursor-pointer transition duration-75 ease-in"
      onClick={onClick}
    >
      Cancel
    </div>
  </>
}