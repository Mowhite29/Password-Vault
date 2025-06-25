import {} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./Home";
import PasswordChange from "./components/PasswordChange";
import Vault from "./components/Vault";
import VerifyEmail from "./components/VerifyEmail";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vault/" element={<Vault />} />
          <Route
            path="/verify-email/:uidb64/:token/"
            element={<VerifyEmail />}
          />
          <Route
            path="/password-change-confirm/:uidb64/:token"
            element={<PasswordChange />}
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
