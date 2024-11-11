import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { convertFieldValuesToUser } from "../libs/convertirValuesAUSer.ts";

// Componente Login
export function Login() {
  const [isLoading, setIsLoading] = useState(false);

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
  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await signin(convertFieldValuesToUser(data));
    } finally {
      setIsLoading(false);
    }
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
            <p className="text">Correo electrónico o Nombre de Usuario</p>
            <input
              className="textbox"
              type="text"
              {...register("username", { required: true })}
            />
            <div className="br"></div>
            {errors.username && (
              <span className="MensajeError">* El campo es requerido</span>
            )}
          </label>
          <label>
            <p className="text">Contraseña</p>
            <input
              className="textbox"
              type="password"
              {...register("password", { required: true })}
            />
            <div className="br"></div>
            {errors.password && (
              <span className="MensajeError">
                * El campo contraseña es requerido
              </span>
            )}
            {/* Mostrar errores de autenticación, si existen */}
            {Array.isArray(signinErrors) &&
              signinErrors.map((error, i) => (
                <span className="MensajeError" key={i}>
                  * {error}
                </span>
              ))}
          </label>
          <button className="MainButton" type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
