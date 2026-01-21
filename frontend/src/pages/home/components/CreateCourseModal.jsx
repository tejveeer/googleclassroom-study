import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { courseFormRules } from "./modalConfigs";
import { useCreateCourse } from "../api/mutations";
import { ModalBackground } from "@/components/ModalBackground";

export function CreateCourseModal({ setIsCreateCourseModalSelected }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm({ mode: "onChange" });

  const onCourseCreation = {
    onSuccess: () => setIsCreateCourseModalSelected(false),
    onError: (err) => setError("root", { type: "server", message: err.message })
  }
  const createCourseMutation = useCreateCourse(
    onCourseCreation.onSuccess, 
    onCourseCreation.onError
  );

  const onSubmit = (data) => createCourseMutation.mutate(data);
  return (
    <>
      <ModalBackground setModalOpen={setIsCreateCourseModalSelected}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gray-200 w-86 p-6 shadow-lg rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-xl mb-4">Create Class</h1>
          <Input 
            type="secondary" 
            placeholder="Couse Name"
            error={errors.courseName} 
            {...register("courseName", courseFormRules.courseName)}
          />
          <p className="h-4 text-sm text-gray-500 mb-2">{errors.courseName && errors.courseName.message}</p>

          <Input 
            type="secondary" 
            placeholder="Course Room"
            error={errors.courseRoom} 
            {...register("courseRoom", courseFormRules.courseRoom)}
          />
          <p className="h-4 text-sm text-gray-500 mb-2">{errors.courseRoom && errors.courseRoom.message}</p>

          <Input 
            type="secondary" 
            placeholder="Banner Color"
            error={errors.bannerColor} 
            {...register("bannerColor", courseFormRules.bannerColor)}
          />
          <p className="h-4 text-sm text-gray-500">{errors.bannerColor && errors.bannerColor.message}</p>

          <p className="h-4 text-sm text-gray-500">{errors.root && errors.root.message}</p>
          <input 
            className="
              text-md self-end text-blue-700 
              cursor-pointer hover:text-blue-800 
              transition duration-75 ease-in 
              hover:bg-blue-200 p-2 rounded-full" 
            type="submit" value="Submit" />
        </form>
      </ModalBackground>
    </>
  );
}
