import { Link, /*useLocation,*/ useNavigate } from "react-router-dom";
import "./Nav_Bar.css";
import { useAuth } from "../context/AuthContext";

type Props = {
  IsOpen: boolean;
};

export default function NavBar({ IsOpen }: Props) {
  //const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  /*
  // Only show admin-related pages in these routes
  const isAdminPage =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/informe/") ||
    location.pathname === "/registro-empleado";
  */

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
    <>
      {isAuthenticated && (
        <aside className={IsOpen ? "open" : ""}>
          <nav>
            <div className="contenedor">
              {/* Regular user links */}
              {isAuthenticated && (
                <>
                  {user && user.role === "usuario" && (
                    <>
                      <Link className="item" to="/">
                        Inicio
                      </Link>
                      <Link className="item" to="/turnos">
                        Mis Turnos
                      </Link>
                      <Link className="item" to="/perfil">
                        Mi Perfil
                      </Link>
                    </>
                  )}

                  {user && user.role === "admin" && (
                    <Link className="item" to="/admin">
                      Pagina de Admin
                    </Link>
                  )}

                  {user && user.role === "admin" && (
                    <Link className="item" to="/informe/usuarios">
                      Listado de Usuarios
                    </Link>
                  )}

                  {((user && user.role === "admin") ||
                    user?.role === "profesional") && (
                    <Link className="item" to="/informe/turnos">
                      Listado de Turnos
                    </Link>
                  )}

                  {((user && user.role === "admin") ||
                    user?.role === "secretario") && (
                    <Link className="item" to="/informe/pagos">
                      Registro de Pagos
                    </Link>
                  )}

                  {user && user.role === "admin" && (
                    <Link className="item" to="/registro-empleado">
                      Nuevo Empleado
                    </Link>
                  )}
                </>
              )}
              <a className="item" href="#" onClick={handleLogOut}>
                Cerrar Sesion
              </a>
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
