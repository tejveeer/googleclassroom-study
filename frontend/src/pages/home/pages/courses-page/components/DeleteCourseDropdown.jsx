export function DeleteCourseDropdown({ dropdownRef, onClickDelete, onClose }) {
  return (
    <div
      ref={dropdownRef}
      className="absolute left-56 -bottom-12 z-10 rounded-lg flex flex-col py-2 bg-gray-200 shadow-md"
      onClick={(e) => e.stopPropagation()} // clicking inside shouldn't trigger outside handlers
    >
      <button
        className="hover:bg-gray-400 px-2 py-3 text-left cursor-pointer transition duration-100 ease-in"
        onClick={() => {
          onClickDelete();
          onClose();
        }}
      >
        Delete
      </button>
    </div>
  );
}

