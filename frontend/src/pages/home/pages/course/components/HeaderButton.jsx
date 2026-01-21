import { tw } from "@/utility"

export function HeaderButton({ name, isSelected, onClickButton }) {
  return <>
    <div 
      className={
        tw(
          "cursor-pointer px-5 py-3",
          isSelected 
            ? "border-b-2 border-blue-400 text-blue-400 hover:bg-blue-100" 
            : "hover:bg-gray-100 text-gray-700 ",
        )
      }
      onClick={onClickButton}
    >{name}</div>
  </>
}