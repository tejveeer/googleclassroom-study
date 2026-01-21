export function Banner({ courseName, courseRoom }) {
  return <>
    <div className="w-full h-44 sm:h-60 rounded-2xl p-2 sm:p-5 flex flex-col gap-2 bg-green-400/50">
      <h1 className="mt-2 sm:mt-0 text-4xl text-gray-700">{courseName}</h1>
      <p className="text-lg text-gray-700">{courseRoom}</p>
    </div>
  </>
}