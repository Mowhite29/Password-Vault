import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PasswordChange from "./components/PasswordChange";
import Vault from "./components/Vault";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [token, setToken] = useState("");

  function SignInOut(inOut, accessToken = "") {
    if (inOut === "in") {
      setSignedIn(true);
      setToken(accessToken);
    } else {
      setSignedIn(false);
      setToken("");
    }
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home signedIn={signedIn} SignInOut={SignInOut} />}
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
