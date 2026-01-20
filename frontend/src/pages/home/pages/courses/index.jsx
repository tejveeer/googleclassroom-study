import { useOutletContext } from "react-router";
import { useDeleteCourse } from "./api/mutations";
import { Course } from "./components/Course";

// coursesData: [{ id, courseName, courseRoom, joinId, memberId, userRole, joinedAt }]
export function CoursesDisplayLayout() {
  const courses = useOutletContext();
  const deleteCourseMutation = useDeleteCourse();

  if (!courses) {
    return <p>No courses available yet...</p>
  }

  return <>
    <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
      {courses.map((courseData) => 
        <Course 
          key={courseData.id} 
          courseData={courseData}
          deleteCourseMutation={deleteCourseMutation} 
        />)}
    </div>
  </>;
}
