import { Link, /*useNavigate*/ } from "react-router-dom";
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
    location.pathname === "/admin" ||
    location.pathname.startsWith("/informe/") ||
    location.pathname === "/registro-empleado";

  // Simulando el estado de inicio de sesión
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();

  return (
    <header>
      <div className="marca">
        {/* Rendnerizado condicional */}
        {isAuthenticated && (
          <>
            <img
              id="barraLateral"
              onClick={() => SetIsOpen(!IsOpen)}
              className="options"
              src="../assets/barra-lateral.png"
              alt="NavBar"
            />
          </>
        )}
        {!isOnSpecificPage && (
          <>
            <Link to="/">
              <img className="logo" src="../assets/logo.png" alt="Logo" />
            </Link>
            <Link to="/">
              <p className="MarcaName">Sentirse bien</p>
            </Link>
          </>
        )}
      </div>
      <div className="enlaces">
        {!isAuthenticated ? (
          <>
            <Link to="/">Inicio</Link>

            {!isAuthenticated && (
              <>
                <Link to="/galeria">Galería</Link>
                <Link to="/servicios">Servicios</Link>
              </>
            )}

            {/* Rendnerizado condicional */}
            {isAuthenticated ? (
              <>
                {user && user.role !== "usuario" ? (
                  <>
                    <Link to="/admin">Admin</Link>
                  </>
                ) : (
                  <Link to="/turnos">Turnos</Link>
                )}
                <Link to="/perfil" className="SecondButton">
                  Perfil
                </Link>
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
          </>
        ) : (
          <Link to="/">Volver a la Página ↩</Link>
        )}
      </div>
    </header>
  );
}

export default Header;
