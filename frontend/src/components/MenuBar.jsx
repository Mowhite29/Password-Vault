import { useState } from "react";
import { deviceType } from "detect-it";

import "../styles/MenuBar.scss";

export default function MenuBar({ signedIn, SignInOut, CurrentScreen }) {
  const [open, setOpen] = useState(false);

  function OpenMenu() {
    setOpen(() => !open);
  }

  if (deviceType === "touchOnly") {
    return (
      <div className={open ? "menuContainerOpen" : "menuContainer"}>
        <div className="staticMenuBar">
          <h1>Password Vault</h1>
          <button onClick={() => OpenMenu()}>{open ? "close" : "open"}</button>
        </div>
        <div className="mobileMenu" style={{ display: open ? "flex" : "none" }}>
          <button
            onClick={
              signedIn ? () => SignInOut("out") : () => CurrentScreen("signin")
            }
          >
            {signedIn ? "Sign out" : "Sign in"}
          </button>
          <button
            onClick={() => CurrentScreen("signin")}
            style={{ display: signedIn ? "none" : "flex" }}
          >
            Create account
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="menuContainer">
        <div className="staticMenuBar">
          <h1>Password Vault</h1>
          <h2>Sign in</h2>
        </div>
      </div>
    );
  }
}
