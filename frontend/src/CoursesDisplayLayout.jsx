import { useOutletContext } from "react-router";

// coursesData: [{ id, courseName, courseRoom, joinId, memberId, userRole, joinedAt }]
export function CoursesDisplayLayout() {
  const courses = useOutletContext();

  return <>
    <div className="p-4 flex flex-col md:flex-row gap-4">
      {courses.map((courseData) => <Course key={courseData.id} courseData={courseData} />)}
    </div>
  </>;
}

function Course({ courseData }) {
  return <>
    <article className="size-30 p-2 border border-black flex flex-col">
      <header>
        <h1>{courseData.courseName}</h1>
        <p>{courseData.courseRoom}</p>
      </header>
      <footer className="flex-1 flex flex-col-reverse">
        {courseData.userRole === 'teacher' && <div className="flex flex-row-reverse">
          <div className="three-dots size-4 bg-black"></div>
        </div>}
      </footer>
    </article>
  </>;
}