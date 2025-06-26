import { useState } from "react";
import { redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn, setScreen } from "../redux/authSlice";
import { Register, TokenObtain } from "../services/api";
import "../styles/SignIn.scss";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);
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

  function SignIn() {
    const tokenObtain = tokenObtain(username, password);
    setMessage("Loading");
    setMessageVisible(true);
    tokenObtain.then((tokenObtain) => {
      if (tokenObtain != false) {
        tokenHandler(tokenObtain["access"]);
        handleScreenChange("vault");
      } else {
        setMessage("Cannot sign in, check credentials");
      }
    });
  }

  function CreateAccount() {
    const register = Register(username, password);
    setMessage("Loading");
    setMessageVisible(true);
    register.then((register) => {
      if (register) {
        setMessage(
          "Account creation successful, please verify email address to sign in",
        );
        const url =
          import.meta.env.VITE_FRONTEND_URL +
          "/verify-email/" +
          register.uid +
          "/" +
          register.token +
          "/";
        setTimeout(() => redirect(url), 3000);
      } else {
        setMessage(
          "Account creation unsuccessful, please check entered details, or if you already have an account please sign in ",
        );
      }
    });
  }

  return (
    <div className="signInContainer">
      <form className="signIn">
        <p>Sign in</p>
        <input
          className="usernameInput"
          type="email"
          value={username}
          onChange={usernameInput}
          placeholder="Email address"
          autoComplete="email-address"
        ></input>
        <input
          className="passwordinput"
          type="password"
          value={password}
          onChange={passwordInput}
          placeholder="Password"
          autoComplete="current-password"
        ></input>
        <button className="signInButton">Sign In</button>
      </form>
      <form className="createAccount">
        <p>Create account</p>
        <input
          className="usernameInput"
          type="email"
          value={newUsername}
          onChange={newUsernameInput}
          placeholder="Email address"
        ></input>
        <input
          className="passwordinput"
          type="password"
          value={newPassword}
          onChange={newPasswordInput}
          placeholder="Password"
        ></input>
        <input
          className="nameInput"
          type="text"
          value={name}
          onChange={nameInput}
          placeholder="Name"
        ></input>
        <button className="createAccountButton">Create Account</button>
      </form>
      {messageVisible === true && <div className="messageBox">{message}</div>}
    </div>
  );
}
