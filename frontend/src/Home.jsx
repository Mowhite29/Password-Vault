import {} from "react";
import { useSelector } from "react-redux";
import HeaderBar from "./components/HeaderBar";
import MenuBar from "./components/MenuBar";
import SignIn from "./components/SignIn";
import Vault from "./components/Vault";
import "./styles/Home.scss";

export default function Home() {
  const screen = useSelector((state) => state.auth.screen);
  console.log("screen:", screen);

  return (
    <>
      <HeaderBar />
      <MenuBar />
      <div
        className="home"
        style={{ display: screen === "home" ? "flex" : "none" }}
      ></div>
      {screen === "signin" && <SignIn />}
      {screen === "signin" && <Vault />}
    </>
  );
}
