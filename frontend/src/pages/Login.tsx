import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import IUser from "../types/IUser.ts";
import { useForm, FieldValues } from "react-hook-form";
import { useEffect } from "react";

// Función para convertir FieldValues a User
function convertFieldValuesToUser(fields: FieldValues): IUser {
  return {
    id: fields.id || "",
    email: fields.email || "",
    username: fields.username || "",
    password: fields.password || "",
    names: fields.names,
    surnames: fields.surnames,
    phone: fields.phone,
    sex: fields.sex,
    role: fields.role,
  };
}

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
  } = useForm<IUser>(); // Tipado mejorado con IUser para validación
  const { signin, isAuthenticated, errors: signinErrors } = useAuth(); // Cambié errors por signinErrors para más claridad
  const navigate = useNavigate();

  // Función onSubmit que maneja el envío del formulario
  const onSubmit = handleSubmit((data) => {
    signin(convertFieldValuesToUser(data));
  });

  // Efecto que redirige si el usuario ya está autenticado
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
        {signinErrors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}

        <div className="titulo">
          <h1>Hola de nuevo!</h1>
          <p>👋</p>
        </div>

        <p>
          Inicia sesión o <Link to="/registro">regístrate</Link> para solicitar
          un turno
        </p>

        {/* Formulario de inicio de sesión */}
        <form onSubmit={onSubmit}>
          <label>
            <p>Correo electrónico</p>
            <input
              className="textbox"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="MensajeError">El campo email es requerido</p>
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
              <p className="MensajeError">El campo contraseña es requerido</p>
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
