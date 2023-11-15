import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Swal from "sweetalert2";
import { db } from "../../firebaseSDK";
import tutorialState from "../../recoil/atoms/tutorial/tutorialState";
import userState from "../../recoil/atoms/login/userDataState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";
import CreateProjectBtn from "./CreateProjectBtn";
import Tutorial from "../../components/modal/TutorialModal";

const ProjectListTitle = styled.div`
  font-size: 2rem;
  font-weight: 900;

  margin: 0 0 0 1.25rem;
`;
const ProjectListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 20px 0px;
`;

const Footer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.Color.backgroundColor};
  height: 7rem;
`;

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const {
    project_list: projectList,
    name,
    project_img_URL: projectImgUrl,
    project_intro: projectIntro,
  }: any = useRecoilValue(userState).userData;
  const tutorialData = useRecoilValue(tutorialState).isMainTutorial;
  const setTutorialState = useSetRecoilState(tutorialState);
  const [isShowTutorial, setIsShowTutorial] = useState(false);

  // 프로젝트 리스트 페이지 튜토리얼
  const fetchTutorialData = () => {
    if (!tutorialData) {
      Swal.fire({
        icon: "info",
        title: "Calit에 오신 것을 환영합니다!",
        text: "사용법이 궁금하시다면, 하단의 튜토리얼 보기 버튼을 눌러주세요!",
        showCancelButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        confirmButtonText: "튜토리얼 보기",
        cancelButtonText: "다시보지 않기",
      }).then((result) => {
        if (result.isConfirmed) {
          setIsShowTutorial(true);
        }

        // 다시보지 않기 선택
        if (result.isDismissed) {
          setTutorialState({
            isMainTutorial: true,
          });
        }
      });
    }
  };

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      projectList.map(async (projectId: string) => {
        const docRef = doc(db, "project", projectId);
        const docSnap: any = await getDoc(docRef);

        if (docSnap.exists()) {
          if (docSnap.data().is_deleted === false) {
            return {
              id: projectId,
              name: docSnap.data().name,
              imgUrl: docSnap.data().project_img_URL,
              projectIntro: docSnap.data().project_intro,
            };
          }
        }
        return null;
      }),
    );

    setProjectData(projects.filter((project: any) => project !== null));
  };

  // 프로젝트 리스트 페이지 튜토리얼
  useEffect(() => {
    fetchTutorialData();
  }, []);

  useEffect(() => {
    fetchProjectData();
  }, [name, projectImgUrl, projectIntro, projectList]);

  return (
    <>
      <div style={{ margin: "2.5rem 6.5rem" }}>
        <ProjectListTitle>Project List</ProjectListTitle>
        <InvitationBtn />
        <ProjectListContainer>
          <CreateProjectBtn />
          {projectData.map((project: any) => (
            <ProjectCard
              key={project.id}
              projectId={project.id}
              projectImgUrl={project.imgUrl}
              projectName={project.name}
              projectIntro={project.projectIntro}
              fetchProjectData={fetchProjectData}
            />
          ))}
        </ProjectListContainer>
      </div>
      <Footer />
      <Tutorial
        isShowTutorial={isShowTutorial}
        setIsShowTutorial={setIsShowTutorial}
      />
    </>
  );
}
