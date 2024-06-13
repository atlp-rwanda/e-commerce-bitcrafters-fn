import Home from "../views/Home";
import Login from "../views/Login";
import Layout from "../components/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const Routers: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
