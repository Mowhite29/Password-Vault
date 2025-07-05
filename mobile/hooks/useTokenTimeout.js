import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import { TokenRefresh, TokenObtain } from "../services/api";

const useTokenTimeout = () => {
  const signedIn = useSelector((state) => state.auth.signedIn);
  const refresh = useSelector((state) => state.auth.refreshToken);
  const timeOut = useRef(null);

  const dispatch = useDispatch();

  const newToken = (newToken) => {
    dispatch(setToken(newToken));
  };

  async function TokenGet() {
    const response = await TokenRefresh(refresh);
    newToken(response["access"]);
  }
  timeOut.current = setInterval(() => {
    if (signedIn) {
      TokenGet();
    }
  }, 1800000);
};

export default useTokenTimeout;
