import { useTeachers } from "../api/queries"
import { Teacher } from "./Teacher";

export function TeacherDisplay({ courseId }) {
  const { teachers, isLoading, isSuccess } = useTeachers({ courseId });

  return <>
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-gray-700 border-b border-gray-300 pb-4">Teachers</h1>
      {!isLoading && isSuccess && 
        teachers.map(t => <Teacher key={t.memberId} teacherInfo={t} />)
      }
    </div>
  </>
}