import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { View, Button, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setScreen, signIn } from "../redux/authSlice";
import { TokenRefresh } from "../services/api";
import HeaderBar from "./HeaderBar";
import MenuBar from "./MenuBar";
import SignIn from "./SignIn";
import Vault from "./Vault";
import Account from "./Account";
import About from "./About";
import useKeepBackendAwake from "../hooks/useKeepBackendAwake";
import useTokenTimeout from "../hooks/useTokenTimeout";
import "../styles/Home.scss";

export default function Home() {
  const screen = useSelector((state) => state.auth.screen);

  const dispatch = useDispatch();

  const tokenHandler = (access) => {
    dispatch(signIn(access));
  };

  useEffect(() => {
    FetchUser();

    async function FetchUser() {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken !== null) {
        const request = await TokenRefresh(refreshToken);
        if (request) {
          tokenHandler(request["access"]);
        }
      }
    }
  });

  useKeepBackendAwake();
  useTokenTimeout();

  const handleScreenChange = (newScreen) => {
    dispatch(setScreen(newScreen));
  };

  return (
    <>
      <HeaderBar />
      <MenuBar />
      {screen === "home" && (
        <View style={StyleSheet.home}>
          <View style={StyleSheet.homeContainer}>
            <Text style={StyleSheet.h1}>
              Secure Your Digital Life with Ease
            </Text>
            <Text style={StyleSheet.h2}>
              Keep your passwords safe, organized, and accessible—anytime,
              anywhere.
            </Text>
            <Text style={StyleSheet.h3}>
              Your Passwords. Protected. Simplified. Trusted.
            </Text>
            <Button
              onPress={() => handleScreenChange("signin")}
              title="Get Started Now"
            />
          </View>
        </View>
      )}
      {screen === "signin" && <SignIn />}
      {screen === "vault" && <Vault />}
      {screen === "account" && <Account />}
      {screen === "about" && <About />}
    </>
  );
}
