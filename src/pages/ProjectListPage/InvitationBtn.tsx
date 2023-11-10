import React, { useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBtn from "../../components/layout/ConfirmBtnLayout";

export default function InvitationBtn() {
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
    <div style={{ margin: "2.5rem 0 0 20px" }}>
      <ConfirmBtn type="button" onClick={handleClick} style={{ zIndex: "2" }}>
        초대링크로 입장
      </ConfirmBtn>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="링크를 입력해주세요"
        onKeyDown={handleEnterPress}
        style={{
          width: isClicked ? "100%" : "0",
          height: "2rem",
          maxWidth: "250px",
          padding: "0.2rem 0.5rem",
          margin: "0 0 0 0.5rem",
          border: isClicked ? "1px solid #c9c9c9" : "1px solid white",
          borderRadius: "5px",
          outline: "none",
          transition: "width 0.5s ease-in-out, border 0.4s ease-in-out",
        }}
      />
    </div>
  );
}
