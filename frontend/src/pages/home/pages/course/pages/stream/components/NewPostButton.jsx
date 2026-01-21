import { Pencil } from "lucide-react";

export function NewPostButton({ onClick }) {
  return <>
    <div 
      onClick={onClick} 
      className="flex items-center gap-3 py-2 px-5 select-none self-start cursor-pointer hover:shadow-md transition duration-150 ease-out rounded-full bg-blue-300">
        <Pencil className="size-4 text-blue-800"/>
        <p className="text-blue-800 text-sm">New Post</p>
    </div>
  </>
}