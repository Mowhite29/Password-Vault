import { View, Text, Button, TextInput } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  signIn,
  setScreen,
  setUserEmail,
  setRefreshToken,
} from "../redux/authSlice";
import { Register, TokenObtain, PasswordReset } from "../services/api";
import Email from "./Email";
import StyleSheet from "../styles/SignIn.scss";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [popUpMessage, setPopUpMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [emailURL, setEmailURL] = useState("");
  const [emailType, setEmailType] = useState("");

  const dispatch = useDispatch();

  const usernameInput = (e) => {
    setUsername(e.target.value);
  };

  const passwordInput = (e) => {
    setPassword(e.target.value);
  };

  const newUsernameInput = (e) => {
    setNewUsername(e.target.value);
  };

  const newPasswordInput = (e) => {
    setNewPassword(e.target.value);
  };

  const nameInput = (e) => {
    setName(e.target.value);
  };

  const handleScreenChange = (newScreen) => {
    dispatch(setScreen(newScreen));
  };

  const tokenHandler = (access) => {
    dispatch(signIn(access));
  };

  const userDetails = (details) => {
    dispatch(setUserEmail(details));
  };

  const refreshToken = (refresh) => {
    dispatch(setRefreshToken(refresh));
  };

  async function SignIn() {
    setPopUpMessage("Loading");
    setMessageVisible(true);
    const tokenObtain = await TokenObtain(username, password);
    if (tokenObtain !== false) {
      tokenHandler(tokenObtain["access"]);
      refreshToken(tokenObtain["refresh"]);
      userDetails(username);
      handleScreenChange("vault");
    } else {
      setPopUpMessage("Cannot sign in, check credentials");
      setTimeout(() => setMessageVisible(false), 4000);
    }
  }

  async function CreateAccount() {
    setPopUpMessage("Loading");
    setMessageVisible(true);
    const register = await Register(newUsername, newPassword, name);

    if (register) {
      setPopUpMessage(
        "Account creation successful, please verify email address to sign in",
      );
      const url =
        "/verify-email/" + register["uid"] + "/" + register["token"] + "/";
      setEmailType("email");
      setEmailURL(url);
      setTimeout(() => {
        setEmailVisible(true);
        setMessageVisible(false);
      }, 4000);
    } else {
      setPopUpMessage(
        "Account creation unsuccessful, please check entered details, or if you already have an account please sign in ",
      );
    }
  }

  async function ForgottenPassword() {
    if (username) {
      const response = await PasswordReset(username);
      if (response) {
        setPopUpMessage(
          "Password reset request successful, if there is an account associated with this email address, a password reset email has been sent",
        );
        setMessageVisible(true);
        const url =
          "/password-change-confirm/" +
          response["uid"] +
          "/" +
          response["token"] +
          "/";
        setEmailType("password");
        setEmailURL(url);
        setTimeout(() => setEmailVisible(true), 4000);
      }
    } else {
      setPopUpMessage("Please enter email address");
      setMessageVisible(true);
      setTimeout(() => setMessageVisible(false), 3000);
    }
  }

  return (
    <View style={StyleSheet.signInContainer}>
      <View style={StyleSheet.formContainer}>
        <View style={StyleSheet.forms}>
          <Text style={StyleSheet.h1}>Sign in</Text>
          <TextInput
            style={StyleSheet.usernameInput}
            type="email"
            value={username}
            onChange={usernameInput}
            placeholder="Email address"
            autoComplete="email-address"
          ></TextInput>
          <TextInput
            style={StyleSheet.passwordinput}
            type="password"
            value={password}
            onChange={passwordInput}
            placeholder="Password"
            autoComplete="current-password"
          ></TextInput>
          <Button style={StyleSheet.signInButton} onClick={() => SignIn()} title="Sign In" />
        </View>
        <Button style={StyleSheet.forgottenButton} onClick={() => ForgottenPassword()} title="forgotten password" />
      </View>
      <View style={StyleSheet.formContainer}>
        <View style={StyleSheet.forms}>
          <Text style={StyleSheet.h1}>Create account</Text>
          <TextInput
            style={StyleSheet.usernameInput}
            type="email"
            value={newUsername}
            onChange={newUsernameInput}
            placeholder="Email address"
            autoComplete="email-address"
          ></TextInput>
          <TextInput
            style={StyleSheet.passwordinput}
            type="password"
            value={newPassword}
            onChange={newPasswordInput}
            placeholder="Password"
            autoComplete="none"
          ></TextInput>
          <TextInput
            style={StyleSheet.nameInput}
            type="text"
            value={name}
            onChange={nameInput}
            placeholder="Name"
            autoComplete="name"
          ></TextInput>
          <Button style={StyleSheet.createAccountButton} onClick={() => CreateAccount()}title="Create Account"/>
        </View>
      </View>
      {messageVisible && (
        <View style={StyleSheet.popUpContainer}>
          <Text style={StyleSheet.h1}>{popUpMessage}</Text>
        </View>
      )}
      {emailVisible && (
        <Email
          type={emailType}
          url={emailURL}
          user={name}
          email={username || newUsername}
        />
      )}
    </View>
  );
}
