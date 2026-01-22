import { Dropdown } from "@/components/Dropdown";
import { tw } from "@/utility";
import { MoreVertical, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";

export function Post({ authorName, authorProfile, datePosted, content, comments = [] }) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const kebabRef = useRef(null);

  const onClickDelete = () => {};
  const addComment = () => {};

  const onClickCommentNumber = () => {
    setShowAllComments(prev => !prev);
  };

  const commentsToDisplay =
    showAllComments
    ? comments
    : comments?.slice(0, 1) ?? [];

  return (
    <article className="bg-gray-100 rounded-xl overflow-hidden">
      {/* Post part */}
      <div className="px-6 py-3 border-b border-gray-300 flex flex-col">
        {/* Metadata */}
        <div className="flex gap-3 items-start">
          {/* Profile */}
          <div className="size-10 bg-purple-400 rounded-full shrink-0" />

          {/* Name and date posted */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-800 font-medium leading-5">{authorName}</p>
            <p className="text-xs text-gray-500">{datePosted}</p>
          </div>

          {/* More */}
          <div className="relative">
            <div
              ref={kebabRef}
              type="button"
              className="size-10 flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-200 transition duration-100 ease-in"
              aria-label="More options"
              onClick={() => setShowDropdown(prev => !prev)}
            >
              <MoreVertical className="text-gray-600" />
            </div>
            {showDropdown && 
              <Dropdown 
                dropdownTriggerButtonRef={kebabRef}
                dropdownButtonObject={{
                  "Delete": onClickDelete
                }}
                showDropdown={setShowDropdown}
              />
            }
          </div>
        </div>

        {/* Content of the post */}
        <p className="mt-2 text-gray-800">{content}</p>
      </div>

      {/* Comment part */}
      <div className="flex flex-col px-6 py-3 gap-3">
        {/* Number of comments */}
        {comments.length >= 2 && 
          <button
            type="button"
            className="text-sm -translate-x-2 select-none text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-full transition duration-75 ease-in cursor-pointer font-medium flex items-center gap-2 self-start"
            onClick={onClickCommentNumber}
          >
            {comments.length} comments
          </button>
        }

        {/* (Optional) Comments list placeholder */}
        {commentsToDisplay.map((c) => (
          <Comment 
            key={c.id} 
            authorName={c.authorName} 
            authorProfile={c.authorProfile}
            datePosted={c.datePosted}
            content={c.content} 
          />
        ))}

        {/* Add comment */}
        <AddComment addComment={addComment} hasComments={comments.length !== 0} />
      </div>
    </article>
  );
}

function Comment({ authorName, datePosted, content }) {
  return <div className="flex gap-3">
    <div className="size-9 bg-purple-400 rounded-full shrink-0" />
    <div className="flex-1">
      <p className="text-sm text-gray-800">
        <span className="font-medium">{authorName}</span>
        <span className="text-gray-400"> • {datePosted}</span>
      </p>
      <p className="text-gray-800">{content}</p>
    </div>
  </div>;
}

function AddComment({ addComment, hasComments }) {
  const [comment, setComment] = useState("");
  const [isAddCommentButtonClicked, setIsAddCommentButtonClicked] = useState(false);

  const onClickAddCommentButton = () => {
    setIsAddCommentButtonClicked(true);
  }

  if (hasComments || isAddCommentButtonClicked) {
    return (
      <div className="flex items-center gap-2">
        {/* Profile */}
        <div className="size-9 bg-purple-400 rounded-full shrink-0" />
  
        {/* Input pill */}
        <div
          className="
            flex-1 flex items-center gap-2
            bg-gray-100 rounded-full
            border border-gray-300
            px-4 py-2
            transition
            focus-within:border-blue-600
            focus-within:ring-1 focus-within:ring-blue-600
          "
        >
          <textarea
            name="comment"
            rows={1}
            placeholder="Add class comment..."
            onChange={(e) => setComment(e.target.value)}
            className="
              w-full bg-transparent
              text-sm text-gray-800 placeholder:text-gray-500
              border-0 p-0
              outline-none focus:outline-none
              ring-0 focus:ring-0
              resize-none
            "
          />
        </div>
        <button
          type="button"
          onClick={addComment}
          className={tw(
            "size-10 flex justify-center items-center rounded-full transition duration-75 ease-in text-gray-500",
            comment ? "hover:bg-gray-200 cursor-pointer" : ""
          )}
          aria-label="Send"
        >
          <SendHorizonal className="size-5" />
        </button>
      </div>
    );  
  }

  return <>
    <div className="
      px-3 py-2 text-blue-700 
      text-sm font-medium hover:bg-blue-100 
      self-start rounded-full 
      transition duration-100 ease-in 
      cursor-pointer -translate-x-2"
      onClick={onClickAddCommentButton}
    >
      Add comment
    </div>
  </>
}
