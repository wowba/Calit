import { atom } from "recoil";

interface ProjectStateDefault {
  projectData: any;
}

const defaultValue: ProjectStateDefault = {
  projectData: null,
};

const projectState = atom({
  key: "projectData",
  default: defaultValue,
});

export default projectState;
