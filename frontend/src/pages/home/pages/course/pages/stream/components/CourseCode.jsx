export function CourseCode({ courseCode }) {
  return <>
    <div className="p-3 border border-gray-300 flex flex-col w-50 rounded-xl">
      <p className="text-lg text-gray-700">Course Code</p>
      <p className="text-2xl mt-2 text-gray-700">{courseCode}</p>
    </div>
  </>
}