import { useRef, useState } from "react";

export function Design() {
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");

  return <>
    <div className="flex flex-col gap-4">
      <InputPrimary placeholder="Primary" value={value} setValue={setValue} />
      <InputSecondary placeholder="Secondary" value={value2} setValue={setValue2} />
    </div>
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
export function InputPrimary({ placeholder, value, setValue, error, isRequired = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const shouldFloat = isFocused || value !== "";

  const onClickContainer = () => {
    inputRef.current?.focus();
  };

  return <>
    <div 
      onClick={onClickContainer}
      className={
        tw("group rounded-sm relative w-40 px-3 py-2 flex cursor-text",
          isFocused 
            ? "outline-2 outline-blue-600"  // Blue when focused
            : "outline border-gray-500 hover:outline-2 hover:outline-blue-600"  // Gray default, blue on hover
        )
      }
    >
      <label className={
        tw("absolute top-2 left-1.5 cursor-text text-md",
          shouldFloat && '-translate-y-5.5 scale-80',
          isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",  // Blue when focused
          "bg-white px-1",
          "transition-transform transition-colors duration-75 ease-out"
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

export function InputSecondary({ placeholder, value, setValue, error, isRequired = false }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const shouldFloat = isFocused || value !== "";

  const onClickContainer = () => {
    inputRef.current?.focus();
  };

  return <>
    <div 
      onClick={onClickContainer}
      className={
        tw("group rounded-sm relative w-40 px-3 pb-2 pt-4.5 flex cursor-text bg-gray-200",
          isFocused 
            ? "border-b-2 border-blue-600"  // Blue when focused
            : "border-b border-gray-400 hover:border-blue-500"  // Gray default, blue on hover
        )
      }
    >
      <label className={
        tw("absolute px-1 bg-gray-200 top-3 left-1.5 cursor-text text-md",
          shouldFloat && '-translate-y-3 -translate-x-1.5 scale-80',
          isFocused ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500",  // Blue when focused
          "transition-transform transition-colors duration-75 ease-out"
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
