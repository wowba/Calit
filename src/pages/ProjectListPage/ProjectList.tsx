import React, { useState } from "react";
import ConfirmBtn from "../../components/layout/ConfirmBtnLayout";

export default function ProjectList() {
  const [isClicked, setIsClicked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleClick = () => {
    if (isClicked) {
      window.location.href = inputValue;
      setInputValue("");
    }
    setIsClicked(!isClicked);
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
          />
        ) : null}
      </div>
    </div>
  );
}
