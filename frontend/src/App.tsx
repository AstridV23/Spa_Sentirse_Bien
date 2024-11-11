import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registro from "./pages/Registro.tsx";
import Header from "./components/Header.tsx";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Turn from "./pages/TurnsPage.tsx";
import Perfil from "./pages/Perfil";
import { PopUpProvider } from "./components/PopUpContext";
import Admin from "./pages/Admin/Admin.tsx";
import Footer from "./components/footer";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import NavBar from "./components/Nav_Bar.tsx";
import { useState } from "react";
import Informe from "./pages/Informes/Informes.tsx";

function App() {
  const [IsOpen, SetIsOpen] = useState(false);

  return (
    <>
      <AuthProvider>
        <PopUpProvider>
          <Header SetIsOpen={SetIsOpen} IsOpen={IsOpen} />
          <NavBar IsOpen={IsOpen} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro mode="main" />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/turnos" element={<Turn />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/informe/:tipo" element={<Informe />} />
            <Route
              path="/registro-empleado"
              element={<Registro mode="admin" />}
            />

            <Route element={<ProtectedRoute />}></Route>
          </Routes>
          <Footer />
        </PopUpProvider>
      </AuthProvider>
    </>
  );
}

export default App;
