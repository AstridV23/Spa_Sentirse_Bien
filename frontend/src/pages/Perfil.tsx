import { useEffect, useLayoutEffect, useState } from "react";
import "./Perfil.css";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert";
import axios from "../api/axios";
//import { useAuth } from "../context/AuthContext";

// Define el tipo Perfil
type Perfil = {
  names: string;
  surnames: string;
  username: string;
  email: string;
  phone: string;
  genero: string;
  password: string;
  registro: Date;
  //reservas: number;
};

type PerfilForm = Perfil & {
  confirmPassword: string;
};

export default function Perfil() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [perfil, setPerfil] = React.useState<Perfil | null>(null);
  const [bookingsCount, setBookingsCount] = useState(0);

  const { control, handleSubmit, reset, watch, setValue } = useForm<PerfilForm>(
    {
      defaultValues: {
        names: "",
        surnames: "",
        username: "",
        email: "",
        phone: "",
        genero: "",
        password: "",
        confirmPassword: "",
      },
    }
  );

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const response = await axios.get('/profile');
        const perfilData: Perfil = {
          names: response.data.names ?? "",
          surnames: response.data.surnames ?? "",
          username: response.data.username ?? "",
          email: response.data.email ?? "",
          phone: response.data.phone ?? "",
          genero: response.data.genero ?? "",
          password: response.data.password ?? "",
          registro: response.data.registro ?? new Date(),
        };
        setPerfil(perfilData);
        reset({
          ...perfilData,
          password: "",
          confirmPassword: "",
        });

        if (perfilData.username) {
          const bookingsResponse = await axios.get(`/bookings?username=${perfilData.username}`);
          console.log("Respuesta de bookings:", bookingsResponse.data);
          setBookingsCount(bookingsResponse.data.total);
        }
        
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        swal({
          title: "Error al cargar el perfil, usando datos predeterminados",
          icon: "warning",
          timer: 2000,
        });
        setPerfil(perfil);
        reset({
          ...perfil,
          password: "",
          confirmPassword: "",
        });        
      }
      

    };

    fetchPerfil();
  }, [reset]);

  const registroString = perfil
    ? `${perfil.registro.getDate()}/${perfil.registro.getMonth() + 1}/${perfil.registro.getFullYear()}`
    : "";

  const onSubmit = (data: PerfilForm) => {
    const confirmPassword = watch("confirmPassword");
    if (data.password && data.password !== confirmPassword) {
      swal({
        title: "La contraseña no coincide",
        icon: "warning",
        timer: 1000,
      });
      return;
    }

    const dataToSubmit: Partial<PerfilForm> = { ...data };
    if (!dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    delete dataToSubmit.confirmPassword;

    // Agregar console.log para ver los datos que se envían
    console.log("Datos enviados:", dataToSubmit);

    if (Object.values(dataToSubmit).every((value) => !value)) {
      swal({
        title: "Falta información",
        icon: "warning",
        timer: 1000,
      });
      return;
    }

    const updatedPerfil = {
      ...perfil,
      ...dataToSubmit,
    };

    setPerfil(updatedPerfil as Perfil);
    reset({
      ...updatedPerfil,
      password: "",
      confirmPassword: "",
    });

    // Limpiar los campos de contraseña
    setValue("password", "");
    setValue("confirmPassword", "");

    swal({
      title: "Cambios Hechos",
      icon: "success",
      timer: 1200,
    });
  };

  return (
    <div className="perfil-page">
      <div className="background-image" />
      <div className="perfil-container">
        <div className="titulo">
          <h1>PERFIL</h1>
          <hr />
        </div>
        <div className="section-container">
          <div className="perfil-section">
            <h3>Mi perfil</h3>
            <div className="tarjetaPerfil">
              {perfil && (
                <>
                  <div className="nombres">
                    <h2>{perfil.names}</h2>
                    <h2>{perfil.surnames}</h2>
                  </div>
                  <p>{perfil.email}</p>
                  <p>@{perfil.username}</p>
                  <p>📞 {perfil.phone}</p>
                  <p>{perfil.genero}</p>
                  <img src="assets/perfil.jpg" alt="Foto" />
                  <p>Miembro desde: {registroString}</p>
                  {<p>Reservas: {bookingsCount}</p> }
                </>
              )}
            </div>
          </div>

          <div className="editperfil-section">
            <h3>Editar información de perfil</h3>
            <div className="tarjetaEditarPerfil">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="par">
                  <label>
                    <p className="text">Nombre</p>
                    <Controller
                      name="names"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="text"
                          placeholder="Nombre"
                        />
                      )}
                    />
                  </label>
                  <label>
                    <p className="text">Apellido</p>
                    <Controller
                      name="surnames"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="text"
                          placeholder="Apellido"
                        />
                      )}
                    />
                  </label>
                </div>

                <div className="par">
                  <label>
                    <p className="text">Usuario</p>
                    <Controller
                      name="username"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="text"
                          placeholder="Usuario"
                        />
                      )}
                    />
                  </label>
                  <label>
                    <p className="text">Correo electrónico</p>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="email"
                          placeholder="Correo electrónico"
                        />
                      )}
                    />
                  </label>
                </div>

                <div className="par">
                  <label>
                    <p className="text">Género</p>
                    <Controller
                      name="genero"
                      control={control}
                      render={({ field }) => (
                        <select {...field} className="textbox">
                          <option value="">Seleccione género</option>
                          <option value="Hombre">Hombre</option>
                          <option value="Mujer">Mujer</option>
                          <option value="Otro">Otro</option>
                        </select>
                      )}
                    />
                  </label>
                  <label>
                    <p className="text">Número de Teléfono</p>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="text"
                          placeholder="Número de Teléfono"
                        />
                      )}
                    />
                  </label>
                </div>

                <div className="par">
                  <label>
                    <p className="text">Nueva contraseña</p>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="password"
                          placeholder="Nueva contraseña"
                        />
                      )}
                    />
                  </label>
                  <label>
                    <p className="text">Confirmar contraseña</p>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="textbox"
                          type="password"
                          placeholder="Confirmar contraseña"
                        />
                      )}
                    />
                  </label>
                </div>
                <button className="MainButton" type="submit">
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
