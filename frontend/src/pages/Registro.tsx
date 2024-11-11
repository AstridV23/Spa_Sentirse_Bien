import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { useState, useEffect, useLayoutEffect } from "react";
import { convertFieldValuesToUser } from "../libs/convertirValuesAUSer.ts";
import { registerAdminRequest } from "../api/auth.ts";

type Props = {
  mode: "main" | "admin";
};

export function Register({ mode }: Props) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, isAuthenticated, user, errors: registerErrors } = useAuth();

  const [, /*passwordMatch*/ setPasswordMatch] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && (!user || user.role !== "admin")) {
      if (mode === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, user, mode]);

  const onSubmit = handleSubmit(async (values) => {
    if (values.password === values.password2) {
      setPasswordMatch(true);

      setIsLoading(true);
      try {
        if (mode === "admin") {
          // Usar registerAdmin para el modo admin
          await registerAdminRequest(convertFieldValuesToUser(values));
        } else {
          // Usar signup para el modo normal
          await signup(convertFieldValuesToUser(values));
        }
        await swal("Usuario registrado con éxito", {
          icon: "success",
          timer: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="ingreso" id={mode === "admin" ? "admin" : ""}>
      <div className="background-image" />
      <div className="contenedorRegistro">
        <div className="titulo">
          {mode === "main" ? (
            <>
              <h1>Bienvenido!</h1>
              <img src="/assets/registro.png" alt="" />
            </>
          ) : (
            <h1>CARGAR EMPLEADO</h1>
          )}
        </div>
        {mode === "main" && (
          <p>
            <Link to="/login">Inicia sesión</Link> o regístrate para solicitar
            un turno
          </p>
        )}

        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="username">
              <p className="text">Nombre de Usuario</p>
              <input
                className="textbox"
                type="text"
                id="username"
                {...register("username", { required: true })}
              />
            </label>
            {errors.username && (
              <span className="MensajeError">* Este campo es obligatorio</span>
            )}
          </div>
          <div>
            <div className="par">
              <label htmlFor="firstname">
                <p className="text">Nombres</p>
                <input
                  className="textbox"
                  type="text"
                  id="firstname"
                  {...register("firstname", { required: true })}
                />
              </label>
              <label htmlFor="lastname">
                <p className="text">Apellidos</p>
                <input
                  className="textbox"
                  type="text"
                  id="lastname"
                  {...register("lastname", { required: true })}
                />
              </label>
            </div>
            {errors.firstname && (
              <span className="MensajeError">
                * Estos campos son obligatorios
              </span>
            )}
          </div>

          <div className={mode === "admin" ? "par" : ""}>
            <label htmlFor="email">
              <p className="text">Correo Electrónico</p>
              <input
                className="textbox"
                type="email"
                id="email"
                {...register("email", { required: true })}
              />
            </label>

            {mode === "admin" && (
              <label htmlFor="role">
                <p className="text">Rol</p>
                <select
                  id="role"
                  className="textbox"
                  {...register("role", { required: true })}
                >
                  <option value="">Selecciona</option>
                  <option value="admin">Admin</option>
                  <option value="profesional">Profesional</option>
                  <option value="secretario">Secretario</option>
                </select>
              </label>
            )}
            {errors.email && (
              <span className="MensajeError">* Este campo es obligatorio</span>
            )}
          </div>

          <div>
            <div className="par">
              <label htmlFor="phone">
                <p className="text">Teléfono</p>
                <input
                  className="textbox"
                  type="text"
                  id="phone"
                  {...register("phone", { required: true })}
                />
              </label>
              <label htmlFor="sex">
                <p className="text">Sexo</p>
                <select
                  id="sex"
                  className="textbox"
                  {...register("sex", { required: true })}
                >
                  <option value="">Selecciona</option>
                  <option value="hombre">Hombre</option>
                  <option value="mujer">Mujer</option>
                  <option value="otro">Otro</option>
                </select>
              </label>
            </div>
            {errors.phone && (
              <span className="MensajeError">
                * Estos campos son obligatorios
              </span>
            )}
          </div>

          <div>
            <div className="par">
              <label htmlFor="password">
                <p className="text">Contraseña</p>
                <input
                  className="textbox"
                  type="password"
                  id="password"
                  {...register("password", { required: true })}
                />
              </label>
              <label htmlFor="password2">
                <p className="text">Confirmar contraseña</p>
                <input
                  className="textbox"
                  type="password"
                  id="password2"
                  {...register("password2", { required: true })}
                />
              </label>
            </div>
            {errors.password && (
              <span className="MensajeError">
                * Estos campos son obligatorios
              </span>
            )}
          </div>
          {Array.isArray(registerErrors) &&
            registerErrors.map((error, i) => (
              <p className="MensajeError" key={i}>
                * {error}
              </p>
            ))}
          <button className="MainButton" type="submit" disabled={isLoading}>
            {isLoading ? "Cargando..." : "Registrarse"}
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

export default Register;
