import { useEffect } from "react";
import { usePopUp } from "../components/PopUpContext";
import { useForm, SubmitHandler } from "react-hook-form";
import "./FormPopUp.css";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

type Turno = {
  _id: string;
  service: string;
  treatment: string;
  date: string;
  info?: string;
  status: string;
  amount: number;
};

type Tarjeta = {
  numero: string;
  prop: string;
  cuil: string;
  vto: string;
  codigo: string;
};

type Props = {
  DatosTurno: Turno;
};

export default function FormPago({ DatosTurno }: Props) {
  const { activePopUp, closePopUp } = usePopUp();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Tarjeta>();

  useEffect(() => {
    reset({
      numero: "",
      prop: "",
      cuil: "",
      vto: "",
      codigo: "",
    });
  }, [reset]);

  if (activePopUp !== "pago") return null;

  // Manejador para el envío del formulario ////////////////////////////////////////////////////////////////////////////////////////////////
  const onSubmit: SubmitHandler<Tarjeta> = async (tarjeta) => {
      // Validar el número de tarjeta
    if (!/^\d{16}$/.test(tarjeta.numero)) {
      swal({
        title: "Error",
        text: "Ingrese un número de tarjeta válido de 16 dígitos.",
        icon: "error",
      });
      return;
    }
    const expirationDate = `${tarjeta.vto.slice(0, 2)}-${tarjeta.vto.slice(2, 4)}`;
    // Crea el objeto de pago con la estructura esperada por el backend
    const paymentData = {
      cardType: "crédito", // AGREGAR UN CONTROL PARA EL TIPO DE TARJETA, UNA CASILLA NOMAS JULIAN
      cardNumber: tarjeta.numero,
      cardName: tarjeta.prop,
      expirationDate: expirationDate,
      cvv: tarjeta.codigo,
      cuit: tarjeta.cuil,
      amount: DatosTurno.amount,
      user: user,
      bookingId: DatosTurno._id,
    };

    console.log('Datos enviados al servidor:', paymentData);

    try {
      // Envía los datos al backend
      const response = await axios.post("/payment", paymentData);
      if (response.data.success) {
        
        swal({
          title: "¡Reserva Pagada!",
          text: `Te esperamos en nuestro local pronto`,
          icon: "success",
        });
      } else {
        throw new Error("El pago no fue procesado correctamente");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      swal({
        title: "Error",
        text: "Hubo un problema al procesar el pago. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    }

    console.log("paymentData", paymentData); // Información del pago
    closePopUp(); // Cerrar el popup después del envío
  };

  return (
    <div className="turno-component">
      <div className="popup-overlay">
        <div className="turno-content">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="icon">
              <img src="/assets/pago.png" alt="Pago icon" />
              <h1>REALIZAR PAGO</h1>
            </div>
            <p>Completa el siguiente formulario para enviarnos el pago</p>
            <hr id="hr" />
            <div className="info">
              <p className="info">
                Tratamiento: {DatosTurno.treatment} ~ Servicio:{" "}
                {DatosTurno.service}
              </p>
              <p>
                Fecha: {DatosTurno.date} 
              </p>
            </div>

            <div className="boxLargo">
              <label htmlFor="numero">
                <h4>
                  Número de Tarjeta <span className="required"></span>
                </h4>
                <input
                  className="textbox"
                  type="text"
                  id="numero"
                  {...register("numero", { required: true })}
                />
              </label>
              {errors.numero && (
                <span className="MensajeError">Este campo es obligatorio</span>
              )}
            </div>
            <div className="par">
              <div className="box">
                <label htmlFor="prop">
                  <h4>
                    Nombre del Propietario <span className="required"></span>
                  </h4>
                  <input
                    className="textbox"
                    type="text"
                    id="prop"
                    {...register("prop", { required: true })}
                  />
                </label>
              </div>
              <div className="box">
                <label htmlFor="cuil">
                  <h4>
                    Número de CUIL <span className="required"></span>
                  </h4>
                  <input
                    className="textbox"
                    type="text"
                    id="cuil"
                    {...register("cuil", { required: true })}
                  />
                </label>
              </div>
            </div>
            {(errors.cuil || errors.prop) && (
              <span className="MensajeError">Este campo es obligatorio</span>
            )}
            <div className="par">
              <div className="box">
                <label htmlFor="vto">
                  <h4>
                    Fecha de Vencimiento <span className="required"></span>
                  </h4>
                  <input
                    className="textbox"
                    type="text"
                    id="vto"
                    {...register("vto", { required: true })}
                  />
                </label>
              </div>
              <div className="box">
                <label htmlFor="codigo">
                  <h4>
                    Código de Seguridad <span className="required"></span>
                  </h4>
                  <input
                    className="textbox"
                    type="text"
                    id="codigo"
                    {...register("codigo", { required: true })}
                  />
                </label>
              </div>
            </div>
            {(errors.codigo || errors.vto) && (
              <span className="MensajeError">Este campo es obligatorio</span>
            )}

            <div className="buttons">
              <button type="submit" className="MainButton">
                Confirmar
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

