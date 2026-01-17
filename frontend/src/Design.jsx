import { useRef, useState } from "react";
import { useClickAway } from "react-use";

export function Design() {
  return <>
    <Input placeholder={"Test"} />
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
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const shouldFloat = isFocused || value !== "";

  const onClickContainer = () => {
    inputRef.current?.focus();
  };

  return <>
    <div 
      onClick={onClickContainer}
      className={
        tw("group rounded-sm relative w-40 px-3 py-2 flex outline hover:outline-2 cursor-text border-gray-500 hover:outline-blue-600")
      }
    >
      <label className={
        tw("absolute top-2 left-1.5 cursor-text text-md text-gray-500",
          shouldFloat && '-translate-y-5.5 scale-80 bg-white',
          "bg-white px-1",
          "transition-transform transition-colors duration-75 ease-out",
          "group-hover:text-blue-500"
        )
      }>{placeholder}</label>
      <input 
        ref={inputRef}
        type="text" 
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setValue(e.target.value)} 
        className="w-full appearance-none text-gray-500 outline-none caret-blue-700" 
      />
    </div>
  </>
}


function tw(...args) {
  return args.filter(Boolean).join(' ')
}
