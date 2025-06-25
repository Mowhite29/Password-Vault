import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screen: "home",
  signedIn: false,
  token: "",
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
      state.screen = "home";
    },
    setScreen(state, action) {
      state.screen = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

export const { signIn, signOut, setScreen } = authSlice.actions;
export default authSlice.reducer;
