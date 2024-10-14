import { Link, useLocation } from "react-router-dom";
import "./Nav_Bar.css";
import { useEffect } from "react";

type Props = {
  IsOpen: boolean;
};

export default function NavBar({ IsOpen }: Props) {
  const location = useLocation();
  const isOnSpecificPage = location.pathname === "/admin";

  // Simulando el estado de admin
  const isAdmin = true; // Cambia esto a true para simular que el usuario está logueado
  const AdminType = 1; // Cambia esto a 1 para doctora, 2 para profesional, 3 secretario

  // useEffect para corroborar el estado de IsOpen cada vez que cambie
  useEffect(() => {
    console.log(`El menú está ${IsOpen ? "abierto" : "cerrado"}`);
  }, [IsOpen]); // Se ejecuta cada vez que IsOpen cambia

  return (
    <>
      {/* Renderizado condicional */}
      {isAdmin && isOnSpecificPage && (
        <aside className={IsOpen ? "open" : ""}>
          <nav>
            <div className="contenedor">
              {/* Este bloque se renderiza solo si AdminType === 1 */}
              {AdminType === 1 && (
                <Link className="item" to="/clientes">
                  Registro de Clientes
                </Link>
              )}
              {/* Si es Doctora (AdminType === 1), renderiza todos los botones */}
              {(AdminType === 1 || AdminType === 2) && (
                <>
                  <Link className="item" to="/informeVacio">
                    Botón para Profesional
                  </Link>
                  <Link className="item" to="/informeVacio">
                    Botón para Profesional
                  </Link>
                </>
              )}

              {(AdminType === 1 || AdminType === 3) && (
                <>
                  <Link className="item" to="/informeVacio">
                    Botón para Secretario
                  </Link>
                  <Link className="item" to="/informeVacio">
                    Botón para Secretario
                  </Link>
                </>
              )}
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
