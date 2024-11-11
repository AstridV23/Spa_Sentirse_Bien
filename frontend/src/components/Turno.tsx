import "./Turno.css";
import { usePopUp } from "../components/PopUpContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

type Servicio = {
  service_name: string;
  service_type: string;
  service_description: string;
  service_price: number;
  encargado: {
    id: string;
    name: string;
    email: string;
  };
  hours: string[];
};

type Servicios = {
  [key: string]: Servicio[];
};

type Data = {
  tipoTratamiento: string;
  servicio: string;
  fecha: string;
  hour: string;
  informacion: string;
  cost: number;
  pagoLocal: boolean;
};

export function TurnPopUp() {
  const { activePopUp, closePopUp } = usePopUp();
  const [precio, setPrecio] = useState<number>(0);
  const [servicios, setServicios] = useState<Servicios>({});
  const [, setPagoEnLocal] = useState(false);
  const { isAuthenticated } = useAuth();

  const isOnSpecificPage = location.pathname === "/turnos";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Data>();

  useEffect(() => {
    reset({
      tipoTratamiento: "",
      servicio: "",
      fecha: "",
      hour: "",
      informacion: "",
      cost: 0,
      pagoLocal: false,
    });
    setPagoEnLocal(false);
    setPrecio(0);

    // Cargar los servicios desde el backend
    const fetchServices = async () => {
      try {
        const response = await axios.get("/service"); // Asegúrate de que esta ruta sea la correcta
        const servicesData = response.data;

        // Transformar la respuesta en el formato que necesitas
        const transformedServices: Servicios = servicesData.reduce(
          (acc: Servicios, curr: Servicio) => {
            const { service_type, service_name, service_price } = curr;

            if (!acc[service_type]) {
              acc[service_type] = [];
            }

            acc[service_type].push({
              ...curr,
              service_name: service_name,
              service_price: service_price,
            });

            return acc;
          },
          {}
        );

        setServicios(transformedServices);
      } catch (error) {
        console.error("Error al cargar los servicios", error);
      }
    };

    fetchServices();
  }, [reset]);

  const tipoTratamiento = watch("tipoTratamiento");
  const servicio = watch("servicio");

  // Actualiza el precio si cambia el servicio
  useEffect(() => {
    if (tipoTratamiento && servicio) {
      const selectedService = servicios[tipoTratamiento]?.find(
        (serv) => serv.service_name === servicio
      );
      setPrecio(selectedService ? selectedService.service_price : 0);
    }
  }, [tipoTratamiento, servicio, servicios]);

  if (activePopUp !== "turn") return null;

  // Maneja el cambio del checkbox
  const handlePagoEnLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagoEnLocal(e.target.checked);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Sumamos un día
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  // método para mandar al backend
  const onSubmit = async (data: Data) => {
    if (!isAuthenticated) {
      swal({
        title: "Usuario no autenticado",
        text: "Por favor inicia sesión para reservar un turno.",
        icon: "warning",
        timer: 2500,
      });
      return;
    }

    const formattedDate = new Date(data.fecha);
    formattedDate.setDate(formattedDate.getDate());

    // Crea el objeto de reserva incluyendo la información del usuario
    const reservaTurno = {
      service: data.servicio,
      treatment: data.tipoTratamiento,
      date: formattedDate.toISOString().split("T")[0], // Enviar solo la fecha en formato YYYY-MM-DD
      hour: data.hour,
      info: data.informacion,
      cost: precio,
      paymentLocal: data.pagoLocal,
    };

    console.log("Formulario enviado:", reservaTurno);

    if (!data.tipoTratamiento || !data.servicio || !data.fecha || !data.hour) {
      swal({
        title: "Campos vacíos",
        text: "Ingrese toda la información solicitada",
        icon: "warning",
        timer: 2500,
      });
      return;
    } else {
      try {
        // Enviar los datos al backend
        const response = await axios.post("/bookings", reservaTurno);

        // Manejar la respuesta del backend
        if (response.status === 201) {
          closePopUp();

          const formattedDate = formatDate(data.fecha);
          const alertaString = `Te esperamos el ${formattedDate} a las ${data.hour}hs`;
          await swal({
            title: "¡Reserva confirmada!",
            text: alertaString,
            icon: "success",
          });
          if (isOnSpecificPage) {
            window.location.href = "/turnos";
          }
        }
      } catch (error) {
        console.error("Error al enviar la reserva:", error);
        swal({
          title: "Error",
          text: "Ocurrió un problema al reservar. Inténtalo de nuevo.",
          icon: "error",
        });
      } finally {
        reset();
        setPrecio(0);
        setPagoEnLocal(false);
      }
    }
  };

  // Funciones para limitar la fecha
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <div className="turno-component">
      <div className="popup-overlay">
        <div className="turno-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="icon">
              <img src="/assets/calendario.png" alt="Calendario" />
              <h1>AGENDÁ TU TURNO</h1>
            </div>
            <p>Completa el siguiente formulario para reservar tu turno.</p>
            <hr />
            <div className="Contenedor-dropdowns">
              <div className="par">
                <div className="box">
                  <label htmlFor="tipoTratamiento">
                    <h4>Tratamiento</h4>
                    <select
                      className="textbox"
                      id="tipoTratamiento"
                      {...register("tipoTratamiento", { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {Object.keys(servicios).map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipo}
                        </option>
                      ))}
                    </select>
                  </label>
                  {errors.tipoTratamiento && (
                    <span className="MensajeError">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
                <div className="box">
                  <label htmlFor="servicio">
                    <h4>Servicio</h4>
                    <select
                      className="textbox"
                      id="servicio"
                      {...register("servicio", { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {tipoTratamiento &&
                        servicios[tipoTratamiento]?.map((serv) => (
                          <option
                            key={serv.service_name}
                            value={serv.service_name}
                          >
                            {serv.service_name}
                          </option>
                        ))}
                    </select>
                  </label>
                  {errors.servicio && (
                    <span className="MensajeError">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
              </div>
              <div className="par">
                <div className="box">
                  <label htmlFor="fecha">
                    <h4>
                      Fecha <span className="required"></span>
                    </h4>
                    <input
                      className="textbox"
                      type="date"
                      id="fecha"
                      {...register("fecha", { required: true })}
                      min={minDate}
                      max={maxDateString}
                    />
                  </label>
                  {errors.fecha && (
                    <span className="MensajeError">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
                <div className="box">
                  <label htmlFor="hora">
                    <h4>Hora</h4>
                    <select
                      id="hora"
                      className="textbox"
                      {...register("hour", { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {tipoTratamiento &&
                        servicio &&
                        servicios[tipoTratamiento]
                          ?.find((s) => s.service_name === servicio)
                          ?.hours?.map((hora) => (
                            <option key={hora} value={hora}>
                              {hora}
                            </option>
                          ))}
                    </select>
                  </label>
                  {errors.hour && (
                    <span className="MensajeError">
                      Este campo es obligatorio
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="detalles">
              <h4>Información importante</h4>
              <textarea
                className="textbox"
                {...register("informacion")}
                placeholder="Escriba brevemente información que deberá ser considerada por los empleados"
              />
            </div>
            <h2>Precio: ${precio}</h2>

            <div>
              <input
                type="checkbox"
                id="pago"
                {...register("pagoLocal")}
                onChange={handlePagoEnLocalChange}
              />
              <label htmlFor="pago">Pago en local</label>
            </div>

            <p className="pagos">
              <br />
              Aceptamos métodos de pago: efectivo, transferencia, débito y
              crédito.
            </p>

            <div className="buttons">
              <button type="submit" className="MainButton">
                Agendar
              </button>
              <button
                type="button"
                className="SecondButton"
                onClick={closePopUp}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TurnPopUp;
