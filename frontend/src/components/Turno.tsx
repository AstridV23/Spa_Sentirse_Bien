import Dropdown from "../components/Dropdown";
import { usePopUp } from "../components/PopUpContext";
import { useState } from "react";
import "./Turno.css";
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

type Props = {
  titulo: string;
  label: string;
  options: string[];
  onChange?: (value: string) => void;
};
function Box(props: Props) {
  const { titulo, label, options, onChange } = props;
  return (
    <div className="box">
      <h4>{titulo}</h4>
      <Dropdown label={label} options={options} onChange={onChange} />{" "}
    </div>
  );
}

export function TurnPopUp() {
  const { activePopUp, closePopUp } = usePopUp();

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    tipoTratamiento: "",
    servicio: "",
    fecha: "",
    hora: "",
    informacion: "",
  });

  // Estado para almacenar el precio
  const [precio, setPrecio] = useState<number>(0);

  if (activePopUp !== "turn") return null;

  // Maneja el cambio en los campos del formulario
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Si se cambia el tipo de tratamiento, reinicia el servicio seleccionado y el precio
      if (name === "tipoTratamiento") {
        newData.servicio = ""; // Reinicia el servicio
        setPrecio(0); // Reinicia el precio
      }
      return newData;
    });

    // Si se cambia el servicio, actualiza el precio
    if (name === "servicio") {
      const selectedService = servicios[formData.tipoTratamiento]?.find(
        (serv) => serv.nombre === value
      );
      if (selectedService) {
        setPrecio(selectedService.precio);
      } else {
        setPrecio(0);
      }
    }
  };

  // Obtiene la fecha actual y la fecha de un mes en adelante
  const today = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(today.getMonth() + 1);

  // Formatear fecha a YYYY-MM-DD para el input date
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    const { tipoTratamiento, servicio, fecha, hora, informacion } = formData;

    // Validación de campos obligatorios
    if (!tipoTratamiento || !servicio || !fecha || !hora) {
      swal({
        title: "Campos vacios",
        text: "Ingrese toda la información solicitada",
        icon: "warning",
        timer: 2500,
      });
      return; // Detiene la ejecución si hay campos vacíos
    } else {
      // Formatear la fecha a dd/mm/yyyy
      const formattedDate = new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      });

      // Crear el string con la información
      const turnoString = `Turno reservado: ${tipoTratamiento}, Servicio: ${servicio}, Fecha: ${formattedDate}, Hora: ${hora}, Información: ${informacion}, Precio: $${precio}`;

      // Mostrar el string en la consola
      console.log(turnoString);
      swal({
        title: "¡Reserva confirmada!",
        text: `Te esperamos el ${formattedDate}.`,
        icon: "success",
      });

      // Limpiar los campos del formulario
      setFormData({
        tipoTratamiento: "",
        servicio: "",
        fecha: "",
        hora: "",
        informacion: "",
      });
      setPrecio(0);
      closePopUp();
    }
  };

  return (
    <div className="turno-component">
      <div className="popup-overlay">
        <div className="turno-component-content">
          <form onSubmit={handleSubmit}>
            <div className="icon">
              <img src="../assets/calendario.png" />
              <h1>AGENDÁ TU TURNO</h1>
            </div>
            <p>Completa el siguiente formulario para reservar tu turno.</p>
            <hr />
            <h2>Reserva</h2>
            <div className="Contenedor-dropdowns">
              <div className="par">
                <Box
                  titulo="Tipo de Tratamiento"
                  label="Seleccione"
                  options={Object.keys(servicios)} // Muestra los tipos de tratamiento (Masajes, Belleza, etc.)
                  onChange={(selectedOption) =>
                    handleChange("tipoTratamiento", selectedOption)
                  }
                />
                <Box
                  titulo="Servicio"
                  label={formData.servicio ? formData.servicio : "Seleccione"}
                  options={
                    servicios[formData.tipoTratamiento]?.map(
                      (servicio) => servicio.nombre
                    ) || []
                  } // Muestra los servicios del tipo de tratamiento seleccionado
                  onChange={(selectedOption) =>
                    handleChange("servicio", selectedOption)
                  }
                />
              </div>
              <div className="par">
                <div className="box">
                  <h4>
                    Fecha <span className="required"></span>
                  </h4>
                  <input
                    type="date"
                    name="fecha"
                    id="fecha"
                    placeholder="Ingresar Fecha"
                    min={formatDate(today)}
                    max={formatDate(oneMonthLater)}
                    onChange={(e) => handleChange("fecha", e.target.value)}
                    required
                  />
                </div>
                <Box
                  titulo="Hora"
                  label="Seleccione"
                  options={horas}
                  onChange={(selectedOption) =>
                    handleChange("hora", selectedOption)
                  }
                />
              </div>
            </div>
            <div className="detalles">
              <h4>Información importante</h4>
              <textarea
                className="textbox"
                name="informacion"
                id="informacion"
                placeholder="Escriba brevemente información que deberá ser considerada por los empleados"
                onChange={(e) => handleChange("informacion", e.target.value)}
              />
            </div>
            <h2>Precio: ${precio}</h2>
            <div className="buttons">
              <button type="submit" className="MainButton">
                Agendar
              </button>
              <button className="SecondButton" onClick={closePopUp}>
                Cancelar
              </button>
            </div>
            <p className="pagos">
              La transacción se realiza de forma presencial. Aceptamos como
              método de pago: efectivo, transferencia, débito y credito.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
