import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const userData = useRecoilValue(userState);

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      userData.userData.project_list.map(async (projectId: string) => {
        const docRef = doc(db, "project", projectId);
        const docSnap: any = await getDoc(docRef);

        return { id: projectId, imgUrl: docSnap.data().project_img_URL };
      }),
    );
    setProjectData(projects.filter((project: any) => project !== null));
    console.log(...projectData);
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <div>
      <h1>ProjectList</h1>
      <InvitationBtn />
      {projectData.map((project: any) => (
        <ProjectCard key={project.id} projectImgUrl={project.imgUrl} />
      ))}
    </div>
  );
}
