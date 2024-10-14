import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { convertFieldValuesToUser } from "../libs/convertirValuesAUSer.ts";

// Componente Login
export function Login() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Hooks del formulario y autenticación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate();

  // Función onSubmit que maneja el envío del formulario
  const onSubmit = handleSubmit((data) => {
    signin(convertFieldValuesToUser(data));
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="ingreso">
      <div className="background-image" />
      <div className="contenedor ">
        {/* Mostrar errores de autenticación, si existen */}
        {Array.isArray(signinErrors) &&
          signinErrors.map((error, i) => <div key={i}>{error}</div>)}

        <div className="titulo">
          <h1>Hola de nuevo!</h1>
          <img src="/assets/login.png" alt="" />
        </div>

        <p>
          Inicia sesión o <Link to="/registro">regístrate</Link> para solicitar
          un turno
        </p>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={onSubmit}>
          <label>
            <p>Correo electrónico o Nombre de Usuario</p>
            <input
              className="textbox"
              type="text"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <span>
                <p className="MensajeError">El campo es requerido</p>
              </span>
            )}
          </label>
          <label>
            <p>Contraseña</p>
            <input
              className="textbox"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span>
                <p className="MensajeError">El campo contraseña es requerido</p>
              </span>
            )}
          </label>

          <button className="MainButton" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
