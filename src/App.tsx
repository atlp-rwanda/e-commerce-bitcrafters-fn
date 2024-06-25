import Routers from "./routes";
import "./app.scss";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store";
function App() {
  return (
    <>
      <Provider store={store}>
        <Routers />
      </Provider>
    </>
  );
}

export default App;
