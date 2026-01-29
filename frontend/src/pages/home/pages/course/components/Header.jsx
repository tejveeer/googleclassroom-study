import { useState } from "react";
import { HeaderButton } from "./HeaderButton";
import { useNavigate } from "react-router";

export function Header({ courseId }) {
  const [selectedButton, setSelectedButton] = useState("stream");
  const navigate = useNavigate();

  const onClickButton = (buttonName) => {
    switch (buttonName) {
      case "stream":
        navigate(`/courses/${courseId}`);
        break;
      case "classwork":
        navigate(`/courses/${courseId}/classwork`);
        break;
      case "people":
        navigate(`/courses/${courseId}/people`);
        break;
      case "grades":
        break;
    }
    setSelectedButton(buttonName);
  }

  return <>
    <div className="sticky top-0 z-100 shrink-0 bg-gray-100">
      <div className="sticky top-0 shrink-0 bg-white rounded-tl-4xl flex border-b border-gray-300">
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