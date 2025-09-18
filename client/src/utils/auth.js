// utils/auth.js
import { store } from "../redux/store"; // your redux store
import { loginSuccess } from "../redux/slice/userSlice";

export const saveAuth = ({ user, accessToken }) => {
  // Instead of saving in localStorage, just update Redux
  store.dispatch(loginSuccess({ user, accessToken }));
};
