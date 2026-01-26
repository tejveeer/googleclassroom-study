import { useStudents } from "../api/queries";
import { Student } from "./Student";

export function StudentDisplay({ courseId, isUserTeacher }) {
  const { students, isLoading, isSuccess } = useStudents({ courseId });

  return <>
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-gray-700 border-b border-gray-300 pb-4">Students</h1>
      {!isLoading && isSuccess && 
        students.map(s => 
          <Student 
            key={s.memberId} 
            studentInfo={s} 
            isUserTeacher={isUserTeacher}
            courseId={courseId} 
          />
        )
      }
    </div>
  </>
}