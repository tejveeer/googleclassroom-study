import { useOutletContext } from "react-router";
import { Banner } from "./components/Banner";
import { CourseCode } from "./components/CourseCode";
import { NewPostButton } from "./components/NewPostButton";
import { Upcoming } from "./components/Upcoming";
import { NewPostModal } from "./components/NewPostModal";
import { useState } from "react";

export function Stream() {
  const { courseName, courseRoom, userRole, joinId: courseCode, id: courseId } = useOutletContext();
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const onClickPostButton = () => {
    setPostModalOpen(true);
  };

  return <>
    <div className="p-6 h-full">
      <div className="mx-auto h-full max-w-248 flex flex-col gap-4">
        <Banner courseName={courseName} courseRoom={courseRoom} />
        <div className="flex flex-row gap-4">
          {/* Left container - contains Course Code and Upcoming Work */}
          <div className="hidden md:flex flex-col gap-2 shrink-0">
            <CourseCode courseCode={courseCode} />
            <Upcoming />
          </div>
          {/* Right container - contains New Post button and new Posts */}
          <div className="flex flex-col flex-1 gap-2">
            <NewPostButton onClick={onClickPostButton} />
          </div>
        </div>
      </div>
      {isPostModalOpen && 
        <NewPostModal 
          setPostModalOpen={setPostModalOpen} 
          courseId={courseId}
        />
      }
    </div>
  </>
}