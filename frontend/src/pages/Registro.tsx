import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import IUser from "../types/IUser.ts";
import { useForm, FieldValues } from "react-hook-form";
import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown.tsx";

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
    isAdmin: fields.isAdmin, // Corregido de 'isAdmind' a 'isAdmin'
  };
}

// Componente Register
export function Register() {
  // Hooks del formulario y autenticación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>(); // Tipado mejorado con IUser
  const { signup, isAuthenticated, errors: registerErrors } = useAuth(); // Cambié errors por registerErrors para más claridad
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true); // Habilité el uso de passwordMatch
  const [password2, setPassword2] = useState<string>(""); // Estado para manejar password2
  const [selectedGender, setSelectedGender] = useState<string>(""); // Estado para el género
  const navigate = useNavigate();

  // Efecto que redirige si el usuario ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Función onSubmit que maneja el envío del formulario
  const onSubmit = handleSubmit(async (values) => {
    // Verificamos si las contraseñas coinciden
    if (values.password === password2) {
      // Comprobamos password y password2 aquí
      setPasswordMatch(true);
      signup({ ...convertFieldValuesToUser(values), sex: selectedGender }); // Asegúrate de pasar el género seleccionado
    } else {
      setPasswordMatch(false);
    }
  });

  return (
    <div className="ingreso">
      <div className="background-image" />
      <div className="contenedor R">
        {/* Mostrar errores de registro, si existen */}
        {registerErrors.map((error, i) => (
          <div key={i}>{error}</div>
        ))}
        <div className="titulo">
          <h1>Bienvenido!</h1>
          <p id="R">🙌</p>
        </div>

        <p>
          <Link to="/login">Inicia sesión</Link> o regístrate para solicitar un
          turno
        </p>

        {/* Formulario de registro */}
        <form onSubmit={onSubmit}>
          <label>
            <p>Nombre Completo</p>
            <input
              className="textbox"
              type="text"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p className="MensajeError">
                El campo nombre de usuario es requerido
              </p>
            )}
          </label>
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

          <div className="par">
            <label className="item">
              <p>Teléfono</p>
              <input
                className="textbox"
                type="text"
                {...register("phone", { required: true })}
              />
            </label>
            <label className="item">
              <p>Genero</p>
              <Dropdown
                label={"Genero"}
                options={["Mujer", "Hombre", "Otro"]}
                onChange={(selectedOption) => setSelectedGender(selectedOption)}
              />
            </label>
            {errors.phone && (
              <p className="MensajeError">Debe indicar su número de teléfono</p>
            )}
          </div>

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
          <label>
            <p>Confirmar contraseña</p>
            <input
              className="textbox"
              type="password"
              value={password2} // Asignamos el valor de password2
              onChange={(e) => setPassword2(e.target.value)} // Manejamos el cambio con setPassword2
            />
            {errors.password && (
              <p className="MensajeError">Debe confirmar su contraseña</p>
            )}
          </label>

          {/* Mensaje de error si las contraseñas no coinciden */}
          {!passwordMatch && <p>Las contraseñas no coinciden</p>}
          {/* Error de correo ya en uso */}
          {registerErrors.includes("Correo ya en uso") && (
            <p className="MensajeError">* Correo ya en uso.</p>
          )}

          <button className="MainButton" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
