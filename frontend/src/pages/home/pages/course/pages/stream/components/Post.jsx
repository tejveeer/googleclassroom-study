import { MoreVertical, SendHorizonal } from "lucide-react";

export function Post({ authorName, authorProfile, datePosted, content, comments = [] }) {
  const addComment = () => {};

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
          <button
            type="button"
            className="size-10 flex justify-center items-center rounded-full p-1 cursor-pointer hover:bg-gray-200 transition duration-100 ease-in"
            aria-label="More options"
          >
            <MoreVertical className="text-gray-600" />
          </button>
        </div>

        {/* Content of the post */}
        <p className="mt-2 text-gray-800">{content}</p>
      </div>

      {/* Comment part */}
      <div className="flex flex-col px-6 py-3 gap-3">
        {/* Number of comments */}
        <button
          type="button"
          className="text-sm text-blue-700 font-medium flex items-center gap-2 self-start hover:underline"
        >
          {comments.length} class comments
        </button>

        {/* (Optional) Comments list placeholder */}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="size-9 bg-purple-400 rounded-full shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-800">
                <span className="font-medium">{c.authorName}</span>
                <span className="text-gray-400"> • {c.datePosted}</span>
              </p>
              <p className="text-gray-800">{c.text}</p>
            </div>
          </div>
        ))}

        {/* Add comment */}
        <AddComment addComment={addComment} />
      </div>
    </article>
  );
}

function AddComment({ addComment }) {
  return (
    <div className="flex items-start gap-3">
      {/* Profile */}
      <div className="size-8 bg-purple-400 rounded-full shrink-0 mt-1" />

      {/* Input pill */}
      <div
        className="
          flex-1 flex items-center gap-2
          bg-white rounded-full
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
          className="
            w-full bg-transparent
            text-sm text-gray-800 placeholder:text-gray-500
            border-0 p-0
            outline-none focus:outline-none
            ring-0 focus:ring-0
            resize-none
          "
        />

        <button
          type="button"
          onClick={addComment}
          className="p-1 rounded-full hover:bg-gray-100 transition text-gray-500"
          aria-label="Send"
        >
          <SendHorizonal className="size-5" />
        </button>
      </div>
    </div>
  );
}
