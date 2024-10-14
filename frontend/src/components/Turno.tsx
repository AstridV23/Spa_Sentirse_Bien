import "./Turno.css";
import { usePopUp } from "../components/PopUpContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";

type Servicio = {
  nombre: string;
  precio: number;
};

type Servicios = {
  [key: string]: Servicio[];
};

const servicios: Servicios = {
  Masajes: [
    { nombre: "Antiestres", precio: 5000 },
    { nombre: "Descontracturantes", precio: 6000 },
    { nombre: "Con piedras calientes", precio: 7000 },
    { nombre: "Circulatorios", precio: 5500 },
  ],
  Belleza: [
    { nombre: "Corte de cabello", precio: 2000 },
    { nombre: "Manicura", precio: 1500 },
  ],
  Faciales: [
    { nombre: "Limpieza facial", precio: 3000 },
    { nombre: "Tratamiento antiarrugas", precio: 4500 },
  ],
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
  const [, setPagoEnLocal] = useState(false);
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
  }, [tipoTratamiento, servicio]);

  if (activePopUp !== "turn") return null;

  // Maneja el cambio del checkbox
  const handlePagoEnLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPagoEnLocal(e.target.checked);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Asegúrate de que el día tenga 2 dígitos
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
    return `${day}/${month}`; // Formato dd/mm
  };

  const onSubmit = (data: Data) => {
    const reservaTurno = {
      tipoTratamiento: data.tipoTratamiento,
      servicio: data.servicio,
      fecha: data.fecha,
      hora: data.hora,
      informacion: data.informacion,
      costo: precio, // Incluye el costo
      pagoLocal: data.pagoLocal, // Incluye si es pago en local
    };

    console.log("Formulario enviado:", reservaTurno);

    if (!data.tipoTratamiento || !data.servicio || !data.fecha || !data.hora) {
      swal({
        title: "Campos vacios",
        text: "Ingrese toda la información solicitada",
        icon: "warning",
        timer: 2500,
      });
      return;
    } else {
      const formattedDate = formatDate(data.fecha);
      const alertaString = `Te esperamos el ${formattedDate} a las ${data.hora}hs`;
      swal({
        title: "¡Reserva confirmada!",
        text: alertaString,
        icon: "success",
      });

      // Resetear el formulario
      reset();
      setPrecio(0);
      setPagoEnLocal(false);
      closePopUp();
    }
  };

  // Funciones para limitar la fecha
  const today = new Date();
  const minDate = today.toISOString().split("T")[0]; // Fecha de hoy
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0]; // Fecha + 30 días

  return (
    <div className="turno-component">
      <div className="popup-overlay">
        <div className="turno-component-content">
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
                    <h4>Tipo de Tratamiento</h4>
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
                      max={maxDateString} // Limitar la fecha
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
