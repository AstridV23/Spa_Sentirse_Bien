import { useEffect } from "react";
import { usePopUp } from "../components/PopUpContext";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import "./FormPopUp.css";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { addDays, format } from "date-fns";

type Turno = {
  _id: string;
  service: string;
  treatment: string;
  date: string;
  hour: string;
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
  tarjeta: string;
};

type Props = {
  DatosTurno: Turno;
};

export default function FormPago({ DatosTurno }: Props) {
  const { activePopUp, closePopUp } = usePopUp();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<Tarjeta>({
    defaultValues: {
      numero: "",
      prop: "",
      cuil: "",
      vto: "",
      codigo: "",
      tarjeta: "",
    },
  });

  useEffect(() => {
    reset({
      numero: "",
      prop: "",
      cuil: "",
      vto: "",
      codigo: "",
      tarjeta: "",
    });
  }, [reset]);

  if (activePopUp !== "pago") return null;

  // Manejador para el envío del formulario ////////////////////////////////////////////////////////////////////////////////////////////////
  const onSubmit: SubmitHandler<Tarjeta> = async (tarjeta) => {
    // Eliminar espacios del número de tarjeta
    const numeroSinEspacios = tarjeta.numero.replace(/\s/g, "");

    // Formatear la fecha de vencimiento
    const [month, year] = tarjeta.vto.split("/");
    const formattedExpirationDate = `${month}-${year}`;

    // Validar el número de tarjeta
    if (!/^\d{16}$/.test(numeroSinEspacios)) {
      swal({
        title: "Error",
        text: "Ingrese un número de tarjeta válido de 16 dígitos.",
        icon: "error",
      });
      return;
    }

    // Crea el objeto de pago con la estructura esperada por el backend
    const paymentData = {
      cardType: tarjeta.tarjeta,
      cardNumber: numeroSinEspacios,
      cardName: tarjeta.prop,
      expirationDate: formattedExpirationDate,
      cvv: tarjeta.codigo,
      cuit: tarjeta.cuil,
      amount: DatosTurno.amount,
      user: user,
      bookingId: DatosTurno._id,
    };
    console.log("Datos enviados al servidor:", paymentData);

    try {
      // Envía los datos al backend
      const response = await axios.post("/payment", paymentData);
      if (response.data.success) {
        closePopUp();
        await swal({
          title: "¡Reserva Pagada!",
          text: `Te esperamos en nuestro local pronto`,
          icon: "success",
        });

        // Recargar la página después de cerrar el popup
        window.location.reload();
      } else {
        throw new Error("El pago no fue procesado correctamente");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      await swal({
        title: "Error",
        text: "Hubo un problema al procesar el pago. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\D/g, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
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
                Fecha:{" "}
                {format(addDays(new Date(DatosTurno.date), 1), "dd/MM/yyyy")} ~
                Hora: {DatosTurno.hour}
              </p>
            </div>

            <div className="par">
              <div className="box">
                <label htmlFor="numero">
                  <h4>
                    Número de Tarjeta <span className="required"></span>
                  </h4>
                  <Controller
                    name="numero"
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) =>
                        value.replace(/\s/g, "").length === 16,
                    }}
                    render={({ field }) => (
                      <input
                        className="textbox"
                        type="text"
                        id="numero"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={19} // 16 digits + 3 spaces
                      />
                    )}
                  />
                </label>
                {errors.numero?.type === "required" && (
                  <span className="MensajeError">
                    Este campo es obligatorio
                  </span>
                )}
                {errors.numero?.type === "validate" && (
                  <span className="MensajeError">
                    Ingrese un número de tarjeta válido de 16 dígitos
                  </span>
                )}
              </div>
              <div className="box">
                <label htmlFor="tarjeta">
                  <h4>Tipo de Tarjeta</h4>
                  <select
                    id="tarjeta"
                    className="textbox"
                    {...register("tarjeta", { required: true })}
                  >
                    <option value="">Seleccione</option>
                    <option value="crédito">Crédito</option>
                    <option value="débito">Débito</option>
                  </select>
                </label>
                {errors.tarjeta?.type === "required" && (
                  <span className="MensajeError">
                    Este campo es obligatorio
                  </span>
                )}
              </div>
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
                  <Controller
                    name="cuil"
                    control={control}
                    rules={{
                      required: "Este campo es obligatorio",
                      pattern: {
                        value: /^\d{11}$/,
                        message: "El CUIL debe tener exactamente 11 dígitos",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        className="textbox"
                        type="text"
                        id="cuil"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 11);
                          field.onChange(value);
                        }}
                        maxLength={11}
                      />
                    )}
                  />
                </label>
                {errors.cuil && (
                  <span className="MensajeError">{errors.cuil.message}</span>
                )}
              </div>
            </div>
            <div className="par">
              <div className="box">
                <label htmlFor="vto">
                  <h4>
                    Fecha de Vencimiento <span className="required"></span>
                  </h4>
                  <Controller
                    name="vto"
                    control={control}
                    rules={{
                      required: true,
                      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    }}
                    render={({ field }) => (
                      <input
                        className="textbox"
                        type="text"
                        id="vto"
                        {...field}
                        placeholder="MM/YY"
                        maxLength={5}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "");
                          if (value.length > 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2);
                          }
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </label>
                {errors.vto?.type === "required" && (
                  <span className="MensajeError">
                    Este campo es obligatorio
                  </span>
                )}
                {errors.vto?.type === "pattern" && (
                  <span className="MensajeError">
                    Formato inválido. Use MM/YY
                  </span>
                )}
              </div>
              <div className="box">
                <label htmlFor="codigo">
                  <h4>
                    Código de Seguridad <span className="required"></span>
                  </h4>
                  <Controller
                    name="codigo"
                    control={control}
                    rules={{
                      required: true,
                      pattern: /^[0-9]{3}$/,
                    }}
                    render={({ field }) => (
                      <input
                        className="textbox"
                        type="text"
                        id="codigo"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 3);
                          field.onChange(value);
                        }}
                        maxLength={3}
                      />
                    )}
                  />
                </label>
                {errors.codigo?.type === "required" && (
                  <span className="MensajeError">
                    Este campo es obligatorio
                  </span>
                )}
                {errors.codigo?.type === "pattern" && (
                  <span className="MensajeError">
                    Ingrese un código de 3 dígitos
                  </span>
                )}
              </div>
            </div>

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
