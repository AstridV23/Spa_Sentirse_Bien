import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { Dispatch } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  SetIsOpen: Dispatch<React.SetStateAction<boolean>>;
  IsOpen: boolean;
};

function Header({ SetIsOpen, IsOpen }: Props) {
  const location = useLocation();
  const isOnSpecificPage =
    location.pathname === "/admin" || location.pathname.startsWith("/informe/");

  const navigate = useNavigate();

  // Simulando el estado de inicio de sesión
  const { logout, isAuthenticated } = useAuth();
  const isAdmin = true;

  async function handleLogOut() {
    swal({
      title: "¿Cerrar Sesión?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        logout();
        navigate("/");
      }
    });
  }

  return (
    <header>
      <div className="marca">
        {/* Rendnerizado condicional */}
        {isOnSpecificPage && (
          <>
            <img
              onClick={() => SetIsOpen(!IsOpen)}
              className="options"
              src="../assets/barra-lateral.png"
              alt="NavBar"
            />
          </>
        )}
        <Link to="/">
          <img className="logo" src="../assets/logo.png" alt="Logo" />
        </Link>
        <Link to="/">
          <p className="MarcaName">Sentirse bien</p>
        </Link>
      </div>
      <div className="enlaces">
        <Link to="/">Inicio</Link>
        <Link to="/galeria">Galería</Link>
        <Link to="/servicios">Servicios</Link>

        {/* Rendnerizado condicional */}
        {isAuthenticated ? (
          <>
            {!isAdmin ? (
              <>
                <Link to="/turnos">Turnos</Link>
              </>
            ) : (
              <Link to="/admin">Admin</Link>
            )}
            <Link to="/perfil" className="SecondButton">
              Perfil
            </Link>
            <img
              className="logout"
              src="/assets/logout.png"
              alt="Cerrar Sesion"
              onClick={handleLogOut}
            />
          </>
        ) : (
          <>
            <Link to="/login" className="MainButton">
              Ingresar
            </Link>
            <Link to="/registro" className="SecondButton">
              Registrar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
