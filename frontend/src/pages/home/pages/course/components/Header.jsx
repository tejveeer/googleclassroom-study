import { useState } from "react";
import { HeaderButton } from "./HeaderButton";

export function Header() {
  const [selectedButton, setSelectedButton] = useState("stream");
  const onClickButton = (buttonName) => {
    setSelectedButton(buttonName);
  }

  return <>
    <div className="sticky top-0 z-20 shrink-0 bg-gray-100">
      <div className="sticky top-0 z-100 shrink-0 bg-white rounded-tl-4xl flex border-b border-gray-300">
        <div className="ml-5"></div>
        <HeaderButton 
          name="Stream" 
          isSelected={selectedButton === "stream"}
          onClickButton={() => onClickButton("stream")}
        />
        <HeaderButton 
          name="Classwork"
          isSelected={selectedButton === "classwork"}
          onClickButton={() => onClickButton("classwork")}
        />
        <HeaderButton 
          name="People" 
          isSelected={selectedButton == "people"}
          onClickButton={() => onClickButton("people")}
        />
        <HeaderButton 
          name="Grades" 
          isSelected={selectedButton === "grades"}
          onClickButton={() => onClickButton("grades")}
        />
      </div>
    </div>
  </>
}