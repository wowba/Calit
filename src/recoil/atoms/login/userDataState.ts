import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

interface UserStateDefault {
  userData: unknown;
}

const defaultValue: UserStateDefault = {
  userData: null,
};

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

const userState = atom({
  key: "userInfo",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

export default userState;
