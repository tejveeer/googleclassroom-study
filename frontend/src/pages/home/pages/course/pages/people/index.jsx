import { useOutletContext, useParams } from "react-router";
import { TeacherDisplay } from "./components/TeacherDisplay";
import { StudentDisplay } from "./components/StudentDisplay";

export function PeopleDisplay() {
  const { courseId } = useParams();
  const { course: { userRole } } = useOutletContext();

  return <>
    <div className="p-6 h-full">
      <div className="mx-auto h-full max-w-180 flex flex-col">
        <div className="mt-3"></div>
        <TeacherDisplay courseId={courseId} />
        <div className="mt-16"></div>
        <StudentDisplay courseId={courseId} isUserTeacher={userRole === "teacher"} />
      </div>
    </div>
  </>;
}