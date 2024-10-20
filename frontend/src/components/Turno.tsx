import "./Turno.css";
import { usePopUp } from "../components/PopUpContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

type Servicio = {
  nombre: string;
  precio: number;
};

const horas: string[] = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

type Servicios = {
  [key: string]: Servicio[];
};

type Data = {
  tipoTratamiento: string;
  servicio: string;
  fecha: string;
  hora: string;
  informacion: string;
  costo: number;
  pagoLocal: boolean;
};

export function TurnPopUp() {
  const { activePopUp, closePopUp } = usePopUp();
  const [precio, setPrecio] = useState<number>(0);
  const [servicios, setServicios] = useState<Servicios>({});
  const [, setPagoEnLocal] = useState(false);
  const { user } = useAuth();

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
      hora: "",
      informacion: "",
      costo: 0,
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
          (acc: Servicios, curr: any) => {
            const { service_name, service_type, service_price } = curr;

            if (!acc[service_name]) {
              acc[service_name] = [];
            }

            acc[service_name].push({
              nombre: service_type,
              precio: service_price,
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
        (serv) => serv.nombre === servicio
      );
      setPrecio(selectedService ? selectedService.precio : 0);
    }
  }, [tipoTratamiento, servicio, servicios]);

  if (activePopUp !== "turn") return null;

  // Maneja el cambio del checkbox
  const handlePagoEnLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagoEnLocal(e.target.checked);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  // método para mandar al backend
  const onSubmit = async (data: Data) => {
    if (!user) {
      swal({
        title: "Usuario no autenticado",
        text: "Por favor inicia sesión para reservar un turno.",
        icon: "warning",
        timer: 2500,
      });
      return;
    }
  
    const formattedDate = new Date(data.fecha);
  
    // Crea el objeto de reserva incluyendo la información del usuario
    const reservaTurno = {
      service: data.servicio,
      treatment: data.tipoTratamiento,
      date: formattedDate,
      info: data.informacion,
      cost: precio,
      paymentLocal: data.pagoLocal,
      user: user.id,
    };
  
    console.log("Formulario enviado:", reservaTurno);
  
    if (!data.tipoTratamiento || !data.servicio || !data.fecha || !data.hora) {
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
          const formattedDate = formatDate(data.fecha);
          const alertaString = `Te esperamos el ${formattedDate} a las ${data.hora}hs`;
          swal({
            title: "¡Reserva confirmada!",
            text: alertaString,
            icon: "success",
          });
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
        closePopUp();
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
                      {servicios[tipoTratamiento]?.map((serv) => (
                        <option key={serv.nombre} value={serv.nombre}>
                          {serv.nombre}
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
                      {...register("hora", { required: true })}
                    >
                      <option value="">Seleccione</option>
                      {horas.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </label>
                  {errors.hora && (
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