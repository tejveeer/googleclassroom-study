export function Teacher({ teacherInfo }) {
  console.log(teacherInfo);
  return <>
    <div className="flex items-center">
      <img 
        src={teacherInfo.avatarUrl} 
        alt={teacherInfo.name} 
        referrerPolicy="no-referrer" 
        className="size-8 rounded-full" 
      />
      <h1 className="text-md ml-5 text-gray-600">{teacherInfo.name}</h1>
    </div>
  </>
}