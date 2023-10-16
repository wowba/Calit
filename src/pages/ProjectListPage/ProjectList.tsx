import React, { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBtn from "../../components/layout/ConfirmBtnLayout";

export default function ProjectList() {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    if (
      isClicked &&
      (inputValue.includes("calit-2f888.web.app/") ||
        inputValue.includes("localhost:3000"))
    ) {
      const cutInputValue = inputValue.substring(
        inputValue.lastIndexOf("/") + 1,
      );
      navigate(cutInputValue);
    }
    setInputValue("");
    setIsClicked(!isClicked);
  };

  const handleEnterPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <div>
      <h1>ProjectList</h1>
      <div>
        <ConfirmBtn type="button" onClick={handleClick}>
          초대링크로 입장
        </ConfirmBtn>
        {isClicked ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="링크를 입력해주세요"
            onKeyDown={handleEnterPress}
          />
        ) : null}
      </div>
    </div>
  );
}
