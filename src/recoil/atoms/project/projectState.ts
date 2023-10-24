import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

interface ProjectStateDefault {
  projectData: unknown;
}

const defaultValue: ProjectStateDefault = {
  projectData: null,
};

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

const projectState = atom({
  key: "projectData",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

export default projectState;
