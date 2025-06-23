import {} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PasswordChange from "./components/PasswordChange";
import Vault from "./components/Vault";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vault/" element={<Vault />} />
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
