import { useParams } from "react-router";
import { useCourses } from "../../api/queries";
import { Header } from "./components/Header";

export function Course() {
  const { courseId } = useParams();
  const courses = useCourses(); 

  const userRole = courses.filter(it => it.id == courseId)[0].userRole;
  return <>
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1"></div>
    </div>
  </>
}