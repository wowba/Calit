import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

interface TutorialStateDefault {
  isCalendarTutorial: boolean;
}

const defaultValue: TutorialStateDefault = {
  isCalendarTutorial: false,
};

const tutorialCalendarState = atom({
  key: "calenderTutorial",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

export default tutorialCalendarState;
