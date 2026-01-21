import { useForm } from "react-hook-form";
import { joinCourseFormRules } from "./modalConfigs";
import { Input } from "@/components/Input";
import { useJoinCourse } from "../api/mutations";
import { ModalBackground } from "@/components/ModalBackground";

export function JoinCourseModal({ setIsJoinCourseModalSelected }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({ 
    mode: "onChange",
  });

  const onJoinCourse = {
    onSuccess: () => setIsJoinCourseModalSelected(false),
    onError: (err) => setError("root", { type: "server", message: err.message }),
  }

  const joinCourseMutation = useJoinCourse(onJoinCourse.onSuccess, onJoinCourse.onError);
  const onSubmit = (data) => {
    joinCourseMutation.mutate({ ...data, role: 'student' });
  };

  return (
    <>
      <ModalBackground setModalOpen={setIsJoinCourseModalSelected}>
      <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 bg-gray-200 shadow-lg rounded-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">
            <h1 className="text-lg">Course Code</h1>
            <p className="-mt-1 text-md text-gray-500 mb-4">Ask your teacher for the class code, then enter it here</p>
            <Input 
              type="primary"
              placeholder="Course Code"
              error={errors.joinId}
              labelBg="bg-gray-200"
              {...register("joinId", {
                ...joinCourseFormRules.joinId,
                onChange: () => {
                  clearErrors("root");
                }
              })} 
            />
            <p className="h-3 text-sm text-gray-500">
              {errors.root?.message || errors.joinId?.message}
            </p>
          </div>
          <input
            className="text-md self-end text-blue-700 cursor-pointer hover:text-blue-800 transition duration-75 ease-in hover:bg-blue-200 p-2 rounded-full" type="submit" value="Submit" />
        </form>
      </ModalBackground>
    </>
  );
}
