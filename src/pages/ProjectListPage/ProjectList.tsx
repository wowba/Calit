import React, { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";
import { db } from "../../firebaseSDK";
import userState from "../../recoil/atoms/login/userDataState";
import InvitationBtn from "./InvitationBtn";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
  const [projectData, setProjectData] = useState([]);
  const userData = useRecoilValue(userState);

  // useEffect(() => {
  //   const projectRefs = query(collection(db, "project"));
  //   const unsub = onSnapshot(projectRefs, (querySnapshot) => {
  //     querySnapshot.forEach((project) => {
  //       console.log(project.data().name);
  //     });
  //   });

  //   return () => unsub();
  // }, [userData]);

  const fetchProjectData = async () => {
    const projects: any = await Promise.all(
      userData.userData.project_list.map(async (projectId: string) => {
        const docRef = doc(db, "project", projectId);
        const docSnap: any = await getDoc(docRef);

        return {
          id: projectId,
          name: docSnap.data().name,
          imgUrl: docSnap.data().project_img_URL,
          projectIntro: docSnap.data().project_intro,
        };
      }),
    );
    setProjectData(projects.filter((project: any) => project !== null));
  };

  fetchProjectData();

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  return (
    <div>
      <h1>ProjectList</h1>
      <InvitationBtn />
      <div className="ProjectListContainer" style={containerStyle}>
        {projectData.map((project: any) => (
          <ProjectCard
            key={project.id}
            projectId={project.id}
            projectImgUrl={project.imgUrl}
            projectName={project.name}
            projectIntro={project.projectIntro}
          />
        ))}
      </div>
    </div>
  );
}
