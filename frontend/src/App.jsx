import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import PasswordChange from "./components/PasswordChange";
import Vault from "./components/Vault";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const [screen, setScreen] = useState("home");
  const [signedIn, setSignedIn] = useState(true);
  const [token, setToken] = useState("");

  function CurrentScreen(newScreen) {
    setScreen(newScreen);
  }

  function SignInOut(inOut, accessToken = "") {
    if (inOut === "in") {
      setSignedIn(true);
      setToken(accessToken);
      setScreen("vault");
    } else {
      setSignedIn(false);
      setToken("");
      setScreen("home");
    }
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              signedIn={signedIn}
              screen={screen}
              SignInOut={SignInOut}
              CurrentScreen={CurrentScreen}
            />
          }
        />
        <Route path="/vault/" element={<Vault token={token} />} />
        <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} />
        <Route
          path="/password-change-confirm/:uidb64/:token"
          element={<PasswordChange />}
        />
      </Routes>
    </Router>
  );
}

export default App;
