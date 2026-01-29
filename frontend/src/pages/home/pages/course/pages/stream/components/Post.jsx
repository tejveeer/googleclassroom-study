import { Dropdown } from "@/components/Dropdown";
import { useUser } from "@/pages/home/api/queries";
import { timeAgo, tw } from "@/utility";
import { MoreVertical, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";
import { useAddComment, useDeleteComment, useDeletePost, useUpdatePost } from "../api/mutations";

export function Post({
  postId,
  courseId,

  authorMemberId,
  authorName,
  authorProfile,
  datePosted,
  content,
  comments = [],
  userMemberId,
  userRole,
}) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const kebabRef = useRef(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(content);
  const textareaRef = useRef(null);

  const updatePostMutation = useUpdatePost({
    courseId,
    postId,
    onSuccess: () => {
      setIsEditing(false);
      setShowDropdown(false);
    },
    onError: () => {
      // optional: keep editing open
    },
  });

  const deletePostMutation = useDeletePost({ courseId, postId });

  const onClickDelete = () => {
    deletePostMutation.mutate();
  };

  const onClickEdit = () => {
    setShowDropdown(false);
    setIsEditing(true);

    // Focus after textarea appears in DOM
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const onClickCommentNumber = () => {
    setShowAllComments((prev) => !prev);
  };

  const commentsToDisplay = showAllComments
    ? comments
    : [comments?.at(-1)].filter(Boolean);

  const showKebab =
    userRole === "teacher" ? true : authorMemberId === userMemberId ? true : false;
  const canEditComment = authorMemberId === userMemberId;

  const dropdownButtonObject = 
    canEditComment 
    ? { Delete: onClickDelete, Edit: onClickEdit } 
    : { Delete: onClickDelete };

  const onClickCancelEdit = () => {
    setIsEditing(false);
    setDraftContent(content);
  };

  const onClickSaveEdit = () => {
    updatePostMutation.mutate(draftContent);
  };

  return (
    <article className="bg-gray-100 rounded-xl overflow-hidden">
      {/* Post part */}
      <div className="px-6 py-3 border-b border-gray-300 flex flex-col">
        {/* Metadata */}
        <div className="flex gap-3 items-start">
          {/* Profile */}
          <img referrerPolicy="no-referrer" className="size-10 rounded-full shrink-0" src={authorProfile} />

          {/* Name and date posted */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-600 font-medium leading-5">{authorName}</p>
            <p className="text-xs text-gray-500">{datePosted}</p>
          </div>

          {/* More */}
          {showKebab && (
            <div className="relative">
              <div
                ref={kebabRef}
                type="button"
                className="size-10 flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-200 transition duration-100 ease-in"
                aria-label="More options"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                <MoreVertical className="text-gray-600" />
              </div>

              {showDropdown && (
                <Dropdown
                  dropdownTriggerButtonRef={kebabRef}
                  dropdownButtonObject={dropdownButtonObject}
                  showDropdown={setShowDropdown}
                />
              )}
            </div>
          )}
        </div>

        {/* Content of the post */}
        {isEditing ? (
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              rows={3}
              className="
                w-full
                rounded-lg
                border border-gray-300
                px-3 py-2
                text-sm
                text-gray-800
                focus:outline-none
                focus:ring-2
                focus:ring-blue-600
                resize-none
              "
              onKeyDown={(e) => {
                // Ctrl/Cmd + Enter to save
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  onClickSaveEdit();
                }
                // Escape to cancel
                if (e.key === "Escape") {
                  e.preventDefault();
                  onClickCancelEdit();
                }
              }}
            />

            <div className="flex items-center gap-3 self-end">
              {updatePostMutation.isError ? (
                <p className="text-xs text-red-600">
                  {updatePostMutation.error?.message ?? "Failed to update post"}
                </p>
              ) : null}

              <button
                type="button"
                onClick={onClickCancelEdit}
                disabled={updatePostMutation.isPending}
                className={tw(
                  "cursor-pointer text-sm text-gray-500 hover:text-gray-700",
                  updatePostMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onClickSaveEdit}
                disabled={updatePostMutation.isPending}
                className={tw(
                  "text-sm cursor-pointer font-medium text-blue-700 hover:text-blue-800",
                  updatePostMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                )}
              >
                {updatePostMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-800 whitespace-pre-wrap">{content}</p>
        )}
      </div>

      {/* Comment part */}
      <div className="flex flex-col px-6 py-3 gap-3">
        {/* Number of comments */}
        {comments.length >= 2 && (
          <button
            type="button"
            className="text-sm -translate-x-2 select-none text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-full transition duration-75 ease-in cursor-pointer font-medium flex items-center gap-2 self-start"
            onClick={onClickCommentNumber}
          >
            {comments.length} comments
          </button>
        )}

        {/* Comments list */}
        {commentsToDisplay.map((c) => (
          <Comment
            key={c.commentId}
            commentId={c.commentId}
            postId={postId}
            courseId={courseId}
            authorMemberId={c.memberId}
            authorName={c.name}
            authorProfile={c.avatarUrl}
            datePosted={timeAgo(c.createdAt)}
            content={c.content}
            userMemberId={userMemberId}
            userRole={userRole}
          />
        ))}

        {/* Add comment */}
        <AddComment courseId={courseId} postId={postId} hasComments={comments.length !== 0} />
      </div>
    </article>
  );
}

function Comment({
  commentId,
  postId,
  courseId,
  authorMemberId, 
  authorName, 
  authorProfile, 
  datePosted, 
  content, 
  userMemberId, 
  userRole 
}) {
  const showKebab =
    userRole === "teacher" ? true : authorMemberId === userMemberId ? true : false;

  const [showDropdown, setShowDropdown] = useState(false);
  const kebabRef = useRef(null);

  console.log(commentId);
  const deleteCommentMutation = useDeleteComment({ courseId, postId, commentId });
  const onClickDelete = () => {
    deleteCommentMutation.mutate();
  };

  return (
    <div className="flex gap-3">
      <img referrerPolicy="no-referrer" className="size-9 rounded-full shrink-0" src={authorProfile} />
      <div className="flex-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">{authorName}</span>
          <span className="text-gray-400"> • {datePosted}</span>
        </p>
        <p className="text-gray-800">{content}</p>
      </div>
      {showKebab && (
        <div className="relative shrink-0">
          <div
            ref={kebabRef}
            type="button"
            className="size-10 flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-200 transition duration-100 ease-in"
            aria-label="More options"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <MoreVertical className="text-gray-600" />
          </div>

          {showDropdown && (
            <Dropdown
              dropdownTriggerButtonRef={kebabRef}
              dropdownButtonObject={{
                Delete: onClickDelete
              }}
              showDropdown={setShowDropdown}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AddComment({ courseId, postId, hasComments }) {
  const [comment, setComment] = useState("");
  const [isAddCommentHeaderClicked, setIsAddCommentHeaderClicked] = useState(false);
  const textareaRef = useRef(null);

  const {
    userData: { avatarUrl },
  } = useUser();

  const addCommentMutation = useAddComment({ courseId, postId });

  const onClickAddComment = () => {
    addCommentMutation.mutate(comment, {
      onSuccess: () => {
        setComment("");                 // clear input
        textareaRef.current?.blur();    // unfocus textarea
        setIsAddCommentHeaderClicked(false); // optional: collapse UI
      },
    });
  };

  const onClickAddCommentHeader = () => {
    setIsAddCommentHeaderClicked(true);
  };

  if (hasComments || isAddCommentHeaderClicked) {
    return (
      <div className="flex items-center gap-2">
        {/* Profile */}
        <img referrerPolicy="no-referrer" className="size-9 rounded-full shrink-0" src={avatarUrl} />

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
            ref={textareaRef}
            name="comment"
            rows={1}
            placeholder="Add class comment..."
            value={comment}
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
          onClick={onClickAddComment}
          className={tw(
            "size-10 flex justify-center items-center rounded-full transition duration-75 ease-in text-gray-500",
            comment ? "hover:bg-gray-200 cursor-pointer" : ""
          )}
          aria-label="Send"
          disabled={!comment}
        >
          <SendHorizonal className="size-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="
        px-3 py-2 text-blue-700 
        text-sm font-medium hover:bg-blue-100 
        self-start rounded-full 
        transition duration-100 ease-in 
        cursor-pointer -translate-x-2
      "
      onClick={onClickAddCommentHeader}
    >
      Add comment
    </div>
  );
}
