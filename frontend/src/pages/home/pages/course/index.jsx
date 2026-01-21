import { Outlet, useParams } from "react-router";
import { useCourses } from "../../api/queries";
import { Header } from "./components/Header";

export function Course() {
  const { courseId } = useParams();
  const courses = useCourses(); 

  let course;
  if (courses) {
    course = courses.filter(it => it.id == courseId)[0];
  }
  return <>
    <div className="h-full select-text flex flex-col">
      <Header />
      <div className="flex-1">
        <Outlet context={course} />
      </div>
    </div>
  </>
}