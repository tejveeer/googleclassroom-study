import { useOutletContext } from "react-router";
import { Banner } from "./components/Banner";
import { CourseCode } from "./components/CourseCode";
import { NewPostButton } from "./components/NewPostButton";
import { Upcoming } from "./components/Upcoming";
import { NewPostModal } from "./components/NewPostModal";
import { useState } from "react";
import { Post } from "./components/Post";
import { usePosts } from "./api/queries";
import { timeAgo } from "@/utility";

export function Stream() {
  const { course, userMemberId } = useOutletContext();
  const { courseName, courseRoom, userRole, joinId: courseCode, id: courseId } = course;
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  const { posts } = usePosts({ courseId });

  const onClickPostButton = () => {
    setPostModalOpen(true);
  };

  return <>
    <div className="p-6 h-full">
      <div className="mx-auto h-full max-w-248 flex flex-col gap-4">
        <Banner courseName={courseName} courseRoom={courseRoom} />
        <div className="flex flex-row gap-4">
          {/* Left container - contains Course Code and Upcoming Work */}
          <div className="hidden md:flex flex-col gap-3 shrink-0">
            <CourseCode courseCode={courseCode} />
            <Upcoming />
          </div>
          {/* Right container - contains New Post button and new Posts */}
          <div className="flex flex-col flex-1 gap-3">
            <NewPostButton onClick={onClickPostButton} />
            {posts && posts.map(p => 
              <Post
                key={p.id}
                postId={p.id}
                courseId={courseId}
                authorMemberId={p.authorMemberId}
                authorName={p.authorName}
                authorProfile={p.authorAvatarUrl}
                datePosted={timeAgo(p.createdAt)}
                content={p.content}
                comments={p.comments}
                userMemberId={userMemberId}
                userRole={userRole}
              />
            )}
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