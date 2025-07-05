import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screen: "home",
  signedIn: false,
  token: "",
  refreshToken: "",
  userEmail: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(state, action) {
      state.signedIn = true;
      state.token = action.payload;
      state.screen = "vault";
    },
    signOut(state) {
      state.signedIn = false;
      state.token = "";
      state.refreshToken = "";
      state.screen = "home";
      state.userEmail = {};
    },
    setScreen(state, action) {
      state.screen = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setRefreshToken(state, action) {
      state.refreshToken = action.payload;
    },
    setUserEmail(state, action) {
      state.userEmail = action.payload;
    },
  },
});

export const {
  signIn,
  signOut,
  setScreen,
  setUserEmail,
  setToken,
  setRefreshToken,
} = authSlice.actions;
export default authSlice.reducer;
