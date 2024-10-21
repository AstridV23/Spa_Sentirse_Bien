import { Link, useLocation } from "react-router-dom";
import "./Nav_Bar.css";
//import { useEffect } from "react";

type Props = {
  IsOpen: boolean;
};

export default function NavBar({ IsOpen }: Props) {
  const location = useLocation();
  const isOnSpecificPage =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/informe/") ||
    location.pathname === "/registro-empleado";

  // Simulando el estado de admin
  const AdminType = 1; // Cambia esto a 1 para doctora, 2 para profesional, 3 secretario

  // useEffect para corroborar el estado de IsOpen cada vez que cambie
  //useEffect(() => {
  //console.log(`El menú está ${IsOpen ? "abierto" : "cerrado"}`);
  //}, [IsOpen]); // Se ejecuta cada vez que IsOpen cambia

  return (
    <>
      {/* Renderizado condicional */}
      {isOnSpecificPage && (
        <aside className={IsOpen ? "open" : ""}>
          <nav>
            <div className="contenedor">
              <Link className="item" to="/admin">
                Pagina de Admin
              </Link>
              {/* Este bloque se renderiza solo si AdminType === 1 */}
              {AdminType === 1 && (
                <Link className="item" to="/informe/usuarios">
                  Listado de Usuarios
                </Link>
              )}
              {/* Si es Doctora (AdminType === 1), renderiza todos los botones */}
              {(AdminType === 1 || AdminType === 2) && (
                <Link className="item" to="/informe/turnos">
                  Listado de Turnos
                </Link>
              )}

              {(AdminType === 1 || AdminType === 3) && (
                <Link className="item" to="/informe/pagos">
                  Registro de Pagos
                </Link>
              )}

              {AdminType === 1 && (
                <Link className="item" to="/registro-empleado">
                  Nuevo Empleado
                </Link>
              )}
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
