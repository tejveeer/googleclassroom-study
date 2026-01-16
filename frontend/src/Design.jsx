import { useState } from "react";

export function Design() {
  return <>
    <Input placeholder={"Input"} />
  </>;
}

// input kinds:
//  1. placeholder goes on top of the border
//    - onhover: boder+placeholder darker
//    - onclick: placeholder -> border, placeholder + border are blue, cursor is blue as well
//    - onfail: placeholder+border+error message are red
//  2. placeholder stays below the border
//    - onhover: background gets darker
//    - onclick: placeholder -> below border, border bottom gets highlighted, placeholder 
//                + bottom border are blue
export function Input({ placeholder, error, isRequired = false }) {
  const [isInputClicked, setIsInputClicked] = useState(false);
  const onClickInput = () => setIsInputClicked(prev => !prev);

  return <>
    <div className={
      tw("group relative w-30 p-3 flex outline hover:outline-2 cursor-text hover:border-gray-600", 
      )
    }>
      {/* Placeholder */}
      <label className={
        tw("absolute top-2.5 cursor-text text-xl",
          isInputClicked && '-translate-y-6.5 scale-90 bg-white',
          "bg-transparent px-1",
          "transition-transform transition-colors duration-100 ease-out"
        )
      }>{placeholder}</label>
      <input type="text" onClick={onClickInput} className="w-full appearance-none outline-none" />
    </div>
  </>
}

function tw(...args) {
  return args.filter(Boolean).join(' ')
}
