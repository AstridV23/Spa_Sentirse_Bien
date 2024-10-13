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
  
    const [/*passwordMatch*/, setPasswordMatch] = useState<boolean>(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (isAuthenticated) {
        navigate("/");
      }
    }, [isAuthenticated]);
  
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
        <div className="contenedor R">
        {Array.isArray(registerErrors) && registerErrors.map((error, i) => (
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
  
          <form onSubmit= {onSubmit}>
            <label htmlFor="username">Nombre de Usuario:</label>
             <input
              className="textbox"
              type="text"
              id="username"
              {...register('username', { required: true })}
            />
            {errors.username && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="firstname">Nombres:</label>
              <input
                className="textbox"
                type="text"
                id="firstname"
                {...register('firstname', { required: true })}
            />
            {errors.firstname && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="lastname">Apellidos:</label>
            <input
              className="textbox"
              type="text"
              id="lastname"
              {...register('lastname', { required: true })}
            />
            {errors.lastname && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              className="textbox"
              type="email"
              id="email"
              {...register('email', { required: true })}
            />
            {errors.email && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="phone">Teléfono:</label>
            <input
              className="textbox"
              type="text"
              id="phone"
              {...register('phone', { required: true })}
            />
            {errors.phone && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="sex">Sexo:</label>
            <select id="sex" {...register('sex', { required: true })}>
              <option value="">Selecciona tu sexo</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="otro">Otro</option>
            </select>
            {errors.sex && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="password">Contraseña:</label>
            <input
              className="textbox"
              type="password"
              id="password"
              {...register('password', { required: true })}
            />
            {errors.password && <span>Este campo es obligatorio</span>}
  
            <label htmlFor="password2">Confirmar contraseña</label>
            <input
              className="textbox"
              type="password"
              id="password2"
              {...register('password2', { required: true })}
            />
            {errors.password && <span>Este campo es obligatorio</span>}
  
            <button type="submit">Registrarse</button>
          </form>
        </div>
      </div>
    );
  }

export default Register