import React, { useState } from "react";
import { usePopUp } from "../components/PopUpContext";
import "./FormPopUp.css";
import emailjs from "@emailjs/browser";
import swal from "sweetalert";

export function FormPopUp() {
  // Estado inicial para el formulario
  const frmContact = {
    user_name: "",
    email: "",
    num: "",
    message: "",
    reply_to: "",
  };

  const { activePopUp, closePopUp } = usePopUp();
  const [contact, setContact] = useState(frmContact);

  // Manejador para cambios en los campos del formulario
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Correo del usuario predefinido (puedes cambiarlo cuando tengas login implementado)
    contact.reply_to = contact.email;

    // Llamada a emailjs para enviar el correo al remitente
    emailjs
      .send("service_tm8ntjv", "template_ssqskz4", contact, "vpN5u16jjxNL3dRm1")
      .then(
        (response) => {
          console.log("Success", response.status, response.text);

          // Limpiar el formulario
          setContact(frmContact);

          // Mostrar alerta de éxito
          Alerta();
        },
        (err) => {
          console.log("Error", err);
          alert("Hubo un error al enviar el correo.");
        }
      );

    // Llamada a emailjs para enviar el correo al emisor
    emailjs.send(
      "service_tm8ntjv",
      "template_kt60dsb",
      contact,
      "vpN5u16jjxNL3dRm1"
    );

    closePopUp(); // Cerrar el popup después del envío
  };

  // Si el popup no está activo, no renderiza el formulario
  if (activePopUp !== "form") return null;

  function Alerta() {
    swal("Consulta enviada", "", "success");
  }

  return (
    <div className="form-component">
      <div className="popup-overlay">
        <div className="form-component-content">
          <div className="icon">
            <img src="../assets/gmail2.png" alt="Gmail icon" />
            <h1>ENVIANOS UN CORREO</h1>
          </div>
          <p>Completa el siguiente formulario para enviarnos tu consulta</p>
          <hr />
          <br />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="user_name"
                className="textbox"
                value={contact.user_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                className="textbox"
                value={contact.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="num">Número de teléfono</label>
              <input
                type="text"
                id="num"
                name="num"
                className="textbox"
                value={contact.num}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                className="textbox"
                name="message"
                value={contact.message}
                onChange={handleChange}
                required
              />
            </div>
            <div className="buttons">
              <input type="submit" className="MainButton" value="Enviar" />
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
