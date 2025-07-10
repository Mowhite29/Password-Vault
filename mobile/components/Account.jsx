import { View, Button, Text } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScreen } from "../redux/authSlice";
import { PasswordChange, NameChange, NameRequest } from "../services/api";
import Email from "./Email";
import StyleSheet from "../styles/Account.scss";

export default function Account() {
  const userEmail = useSelector((state) => state.auth.userEmail);
  const token = useSelector((state) => state.auth.token);

  const [popUpMessage, setPopUpMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  const [nameShown, setNameShown] = useState(false);
  const [emailView, setEmailView] = useState(false);
  const [emailURL, setEmailURL] = useState("");
  const [emailType, setEmailType] = useState("");
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const dispatch = useDispatch();

  const handleScreenChange = (newScreen) => {
    dispatch(setScreen(newScreen));
  };

  async function ChangePassword() {
    const response = await PasswordChange(userEmail, token);
    if (response) {
      const url =
        "/password-change-confirm/" +
        response["uid"] +
        "/" +
        response["token"] +
        "/";
      setEmailURL(url);
      setName(response["user"]);
      setEmailType("password");
      setPopUpMessage(
        "A password change confirmation email has been sent to your email address",
      );
      setMessageVisible(true);
      setTimeout(() => setEmailView(true), 5000);
    } else {
      setPopUpMessage("Password change unsuccessful, please try again later");
    }
  }

  async function ChangeName(done = false) {
    if (done) {
      const response = await NameChange(firstname, lastname, token);
      if (response) {
        setPopUpMessage("Name changed successfully");
        setMessageVisible(true);
        setNameShown(false);
        setTimeout(() => {
          setMessageVisible(false);
        }, 3000);
      }
    } else {
      const response = await NameRequest(token);
      if (response) {
        setFirstname(response["first_name"]);
        setLastname(response["last_name"]);
      }
      setNameShown(true);
    }
  }

  const inputHandler = (e) => {
    if (e.target.name === "firstname") {
      setFirstname(e.target.value);
    } else if (e.target.name === "lastname") {
      setLastname(e.target.value);
    }
  };

  return (
    <View style={StyleSheet.accountContainer}>
      <Button
        style={StyleSheet.return}
        onClick={() => handleScreenChange("vault")}
        title="Return to vault"
      />
      <Button onClick={() => ChangePassword()} title="Change password" />
      <Button onClick={() => ChangeName()} title="Change name" />
      {nameShown && (
        <View style={StyleSheet.nameChange}>
          <View>
            <Text style={StyleSheet.h2}>First name:</Text>
            <input
              type="text"
              name="firstname"
              value={firstname}
              onChange={inputHandler}
            ></input>
          </View>
          <View>
            <Text style={StyleSheet.h2}>Last name:</Text>
            <input
              type="text"
              name="lastname"
              value={lastname}
              onChange={inputHandler}
            ></input>
          </View>
          <Button onClick={() => ChangeName(true)} title="Change name" />
          <Button onClick={() => setNameShown(false)} title="Cancel" />
        </View>
      )}
      {messageVisible && (
        <View style={StyleSheet.popUpContainer}>
          <h1>{popUpMessage}</h1>
        </View>
      )}
      {emailView && (
        <Email type={emailType} url={emailURL} user={name} email={userEmail} />
      )}
    </View>
  );
}
