import React, { useState } from "react";
import { usePopUp } from "../components/PopUpContext";
import "./FormPopUp.css";
import swal from "sweetalert";

type Data = {
  tipoTratamiento: string;
  servicio: string;
  formattedDate: string;
  fecha: string;
  hora: string;
  informacion: string;
  costo: number;
};

type Props = {
  DatosTurno: Data;
  setReservaCompleta: (reservaCompleta: boolean) => void;
};

export default function FormPago({ DatosTurno, setReservaCompleta }: Props) {
  // Estado inicial para el formulario
  const frmTarjeta = {
    numero: "",
    prop: "",
    cuil: "",
    vto: "",
    codigo: "",
  };

  const { closePopUp } = usePopUp();
  const [tarjeta, setTarjeta] = useState(frmTarjeta);

  // Manejador para cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validar solo números para los campos específicos
    if (name === "numero" || name === "cuil" || name === "codigo") {
      if (!/^\d*$/.test(value)) return; // Permitir solo dígitos
    }

    // Validar que el nombre del propietario no contenga números
    if (name === "prop") {
      if (/\d/.test(value)) return; // No permitir números
    }

    // Formato automático para "vto"
    if (name === "vto") {
      if (value.length > 5) return; // Limitar a 5 caracteres (MM/YY)
      if (!/^\d{0,2}\/?\d{0,2}$/.test(value)) return; // Validar formato MM/YY

      let formattedValue = value.replace(/\D/g, ""); // Remover caracteres no numéricos
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(
          2
        )}`;
      }
      setTarjeta({ ...tarjeta, [name]: formattedValue });
      return;
    }

    // Validación para el campo de código de seguridad
    if (name === "codigo") {
      if (value.length > 3) return; // Limitar longitud a 3 caracteres
    }

    setTarjeta({ ...tarjeta, [name]: value });
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTarjeta(tarjeta);

    // Crear el string con la información
    const alertaString = `Te esperamos el ${DatosTurno.formattedDate} a las ${DatosTurno.hora}hs`;

    swal({
      title: "¡Reserva confirmada!",
      text: alertaString,
      icon: "success",
    });

    console.log(tarjeta); //info de la tarjeta AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    console.log(DatosTurno); //info del turno AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    closePopUp(); // Cerrar el popup después del envío
    setReservaCompleta(false);
  };

  return (
    <>
      <div className="icon">
        <img src="/assets/pago.png" alt="Pago icon" />
        <h1>REALIZAR PAGO</h1>
      </div>
      <p>Completa el siguiente formulario para enviarnos el pago</p>
      <hr />
      <div className="info">
        <p className="info">
          Tratamiento: {DatosTurno.tipoTratamiento} ~ Servicio:{" "}
          {DatosTurno.servicio}
        </p>
        <p>
          Fecha: {DatosTurno.formattedDate} ~ Hora: {DatosTurno.hora} hs
        </p>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="numero">Número de tarjeta</label>
          <input
            type="text"
            id="numero"
            name="numero"
            className="textbox"
            value={tarjeta.numero}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prop">Nombre completo del propietario</label>
          <input
            type="text"
            id="prop"
            name="prop"
            className="textbox"
            value={tarjeta.prop}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cuil">CUIL</label>
          <input
            type="text"
            id="cuil"
            name="cuil"
            className="textbox"
            value={tarjeta.cuil}
            onChange={handleChange}
            required
          />
        </div>
        <div className="par">
          <div className="form-group">
            <label htmlFor="vto">Fecha vto.</label>
            <input
              type="text"
              id="vto"
              name="vto"
              className="textbox"
              value={tarjeta.vto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="codigo">Código seg.</label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              className="textbox"
              value={tarjeta.codigo}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="buttons">
          <input type="submit" className="MainButton" value="Confirmar" />
          <button
            type="button"
            className="SecondButton"
            onClick={() => setReservaCompleta(false)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}
