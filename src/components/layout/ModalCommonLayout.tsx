import React, { ReactNode } from "react";
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

// const ModalArea = styled.div`
//   width: 20rem;
//   height: 20rem;
//   z-index: 999;
//   position: absolute;
//   top: 4rem;
//   right: 0;
//   border-radius: 7px;
//   box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);

//   &.isHide {
//     display: none;
//   }

//   &.isShow {
//     display: block;
//   }
// `;

interface ModalInfo {
  key?: number;
  // onClick: void;
  // modalIndex: number;
  // modalName: string;
  // modalIcon: string;
  // modalSelected: string;
  children?: ReactNode;
}

export default function ModalCommon(name: ModalInfo) {
  const { key, children } = name;
  console.log(key, children);

  const handleClick = (child: any) => {
    const xxx = child;
    console.log(xxx);
  };

  return (
    <ModalLayout>
      <ModalBox onClick={() => handleClick(children)}>{children}</ModalBox>
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
