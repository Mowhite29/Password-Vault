import { Text, View, Button } from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut, setScreen } from "../redux/authSlice";

import StyleSheet from "../styles/MenuBar.scss";

export default function MenuBar() {
  const [open, setOpen] = useState(false);
  const signedIn = useSelector((state) => state.auth.signedIn);
  const screen = useSelector((state) => state.auth.screen);
  const dispatch = useDispatch();

  function OpenMenu() {
    setOpen(() => !open);
  }

  const handleSignOut = () => {
    dispatch(signOut());
  };

  const handleScreenChange = (newScreen) => {
    dispatch(setScreen(newScreen));
    setOpen(false);
  };

  return (
    <View
      style={open ? StyleSheet.menuContainerOpen : StyleSheet.menuContainer}
    >
      <View style={StyleSheet.staticMenuBar}>
        <Text style={StyleSheet.h1}>Password Vault</Text>
        <Button
          onClick={() => OpenMenu()}
          title={open ? "close menu" : "open menu"}
        />
      </View>
      {open ? (
        <View style={StyleSheet.mobileMenu}>
          {screen !== "home" && (
            <Button onClick={() => handleScreenChange("home")}>Home</Button>
          )}
          <Button onClick={() => handleScreenChange("about")} title="About" />
          {signedIn ? (
            <Button
              onClick={() => handleScreenChange("account")}
              title="My account"
            />
          ) : null}
          <Button
            onClick={
              signedIn
                ? () => handleSignOut()
                : () => handleScreenChange("signin")
            }
            title={signedIn ? "Sign out" : "Sign in"}
          />
          {signedIn ? null : (
            <Button
              onClick={() => handleScreenChange("signin")}
              title="Create account"
            />
          )}
        </View>
      ) : null}
    </View>
  );
}
