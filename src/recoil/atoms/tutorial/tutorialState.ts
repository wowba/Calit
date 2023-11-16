import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

interface TutorialStateDefault {
  isMainTutorial: boolean;
}

const defaultValue: TutorialStateDefault = {
  isMainTutorial: false,
};

const tutorialState = atom({
  key: "mainTutorial",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

export default tutorialState;
