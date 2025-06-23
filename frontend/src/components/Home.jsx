import {} from "react";
import HeaderBar from "./HeaderBar";
import MenuBar from "./MenuBar";
import "../styles/Home.scss";

export default function Home(signedIn, SignInOut) {
  return (
    <>
      <HeaderBar />
      <MenuBar signedIn={signedIn} SignInOut={SignInOut} />
    </>
  );
}
