import { Provider } from "react-redux";
import { store } from "../redux/store.js";
import Home from "../components/Home.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
