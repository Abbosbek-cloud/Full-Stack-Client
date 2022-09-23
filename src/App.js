import { useLocation, useRoutes } from "react-router-dom";
import "./App.css";
import Layout from "./layouts/Main";
import { routes } from "./routes/appRoutes";

function App() {
  const content = useRoutes(routes);
  const { pathname } = useLocation();

  return <Layout>{content}</Layout>;
}

export default App;
