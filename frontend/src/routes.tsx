import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Registro";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Turn from "./pages/TurnsPage.tsx";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin/Admin.tsx";
import Informe from "./pages/Informes/Informes.tsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register mode="main" />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/turnos" element={<Turn />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="/informe/:tipo" element={<Informe />} />
        <Route path="/registro-empleado" element={<Register mode="admin" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
