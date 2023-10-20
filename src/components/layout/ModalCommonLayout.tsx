import React, { ReactElement, useState } from "react";
import { styled } from "styled-components";

const ModalLayout = styled.div`
  // position: relative;
`;

const ModalBox = styled.div`
  display: flex;
  position: relative;

  button {
    margin-right: 1rem;
  }
`;

const ModalArea = styled.div`
  width: 20rem;
  height: 20rem;
  z-index: 999;
  position: absolute;
  top: 4rem;
  right: 0;
  border-radius: 7px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);

  &.isHide {
    display: none;
  }

  &.isShow {
    display: block;
  }
`;

interface ModalInfo {
  // onClick: void;
  // modalIndex: number;
  // onClick: React.MouseEventHandler<HTMLButtonElement>;
  // onClick: (n: number) => number;
  // onClick: (n: number) => void;
  // modalIcon: string;
  modalSelected?: number;
  modalIndex: number;
  children?: ReactElement;
}

export default function ModalCommon(name: ModalInfo) {
  const { modalIndex, modalSelected, children } = name;
  const [isModalClicked, setModalClicked] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>();
  // const idxValue = onClick(modalIndex);
  // console.log(idxValue);

  // console.log("now", modalIndex);

  // const handleModal = (index: number) => {
  //   // setActiveIndex((prev) => (prev === index ? -1 : index));
  //   setActiveIndex(index);
  //   console.log("index: ", activeIndex);
  // };

  const handleClick = () => {
    console.log("before", activeIndex);
    setModalClicked(!isModalClicked);
    // handleModal(modalSelected);
    setActiveIndex(modalSelected);
    console.log("after", activeIndex);
    // const idxValue = onClick(modalIndex);
    // console.log(idxValue, modalIndex);
    // if (idxValue === modalIndex) {
    //   console.log(true);
    // } else {
    //   console.log(false);
    // }

    // console.log(onClick(modalIndex));
  };

  return (
    <ModalLayout>
      <ModalBox key={modalIndex} onClick={handleClick}>
        {children}
        {isModalClicked === true ? (
          <ModalArea
            className={activeIndex === modalIndex ? "isShow" : "isHide"}
          />
        ) : null}
      </ModalBox>
    </ModalLayout>
  );
  // const { modalIndex, modalName, children, modalSelected } = name;
  // const [isModalClicked, setModalClicked] = useState(false);
  // const [activeIndex, setActiveIndex] = useState<number>();
  // const [isModalSelected, setModalSelected] = useState(false);

  // const handleModal = (index: number) => {
  //   setActiveIndex(index);
  // };
  // const handleModalClick = () => {
  //   // setModalClicked(!isModalClicked);
  //   handleModal(modalIndex);
  // };

  // useEffect(() => {
  //   if (modalSelected !== modalName) {
  //     setModalSelected(true);
  //   } else {
  //     setModalSelected(false);
  //   }
  // }, [modalSelected]);

  // return (
  //   <ModalLayout>
  //     <ModalBox onClick={handleModalClick}>
  //       {children}
  //       {activeIndex === modalIndex ? (
  //         <ModalArea className={isModalSelected ? "isHide" : "isShow"}>
  //           {modalName}
  //         </ModalArea>
  //       ) : null}
  //     </ModalBox>
  //   </ModalLayout>
  // );
}
