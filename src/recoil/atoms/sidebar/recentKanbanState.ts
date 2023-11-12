import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "recentKanban",
  storage: localStorage,
});

type RecentKanbanState = {
  [key: string]: Array<string>;
};

const recentKanbanState = atom<RecentKanbanState>({
  key: "recentKanbanId",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export default recentKanbanState;
