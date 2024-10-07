import "./Login.css";
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
      phone: fields.phone  ||"",
      surnames: fields.surnames,
      sex: fields.sex,
      role: fields.role,
    };
  }

export function Register() {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();
    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const [selectedGender, setSelectedGender] = useState<string>("");
    const [passwordMatch, setPasswordMatch] = useState<boolean>(true);
    const [password2, setPassword2] = useState<string>("");
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated, navigate]);
  
    const onSubmit = handleSubmit(async (values) => {
      if (values.password === values.password2) {
        setPasswordMatch(true);
        signup({...convertFieldValuesToUser(values), sex: selectedGender});
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
              <p>Nombre de usuario</p>
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


export default Register