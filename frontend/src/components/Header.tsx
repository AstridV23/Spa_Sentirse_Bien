import { Link } from "react-router-dom";
import "./Header.css";
import { Dispatch } from "react";
import { useLocation } from "react-router-dom";

type Props = {
  SetIsOpen: Dispatch<React.SetStateAction<boolean>>;
  IsOpen: boolean;
};

function Header({ SetIsOpen, IsOpen }: Props) {
  const location = useLocation();
  const isOnSpecificPage = location.pathname === "/admin";

  // Simulando el estado de inicio de sesión
  const isLoggedIn = true; // Cambia esto a true para simular que el usuario está logueado
  const isAdmin = false;

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
        {isLoggedIn ? (
          <>
            {!isAdmin && (
              <>
                <Link to="/turnos">Turnos</Link>
              </>
            )}
            <Link to="/perfil" className="SecondButton">
              Perfil
            </Link>
            <img
              className="logout"
              src="/assets/logout.png"
              alt="Cerrar Sesion"
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
