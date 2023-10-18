import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({
  key: "localStorage",
  storage: localStorage,
});

interface LoginStateDefault {
  isLogin: boolean;
  userCredential: unknown;
}

const defaultValue: LoginStateDefault = {
  isLogin: false,
  userCredential: null,
};

const loginState = atom({
  key: "isLogin",
  default: defaultValue,
  effects_UNSTABLE: [persistAtom],
});

export default loginState;
