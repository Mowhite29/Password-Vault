import {} from "react";
import HeaderBar from "./components/HeaderBar";
import MenuBar from "./components/MenuBar";
import SignIn from "./components/SignIn";
import Vault from "./components/Vault";
import "./styles/Home.scss";

export default function Home(props) {
  return (
    <>
      <HeaderBar />
      <MenuBar {...props} />
      <SignIn styles={{ display: screen === "signin" ? "flex" : "none" }} />
      <Vault styles={{ display: screen === "vault" ? "flex" : "none" }} />
    </>
  );
}
