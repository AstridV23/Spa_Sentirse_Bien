import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { convertFieldValuesToUser } from "../libs/convertirValuesAUSer.ts";

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { signup, isAuthenticated, errors: registerErrors } = useAuth();

  const [, /*passwordMatch*/ setPasswordMatch] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (values) => {
    if (values.password === values.password2) {
      setPasswordMatch(true);
      signup(convertFieldValuesToUser(values));
    } else {
      setPasswordMatch(false);
    }
  });

  return (
    <div className="ingreso">
      <div className="background-image" />
      <div className="contenedorRegistro">
        <div className="titulo">
          <h1>Bienvenido!</h1>
          <img src="/assets/registro.png" alt="" />
        </div>
        <p>
          <Link to="/login">Inicia sesión</Link> o regístrate para solicitar un
          turno
        </p>

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

          <div>
            <label htmlFor="email">
              <p className="text">Correo Electrónico</p>
              <input
                className="textbox"
                type="email"
                id="email"
                {...register("email", { required: true })}
              />
            </label>
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
          <button type="submit" className="MainButton">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
