import { useEffect } from "react";
import { usePopUp } from "../components/PopUpContext";
import { useForm, SubmitHandler } from "react-hook-form";
import "./FormPopUp.css";
import swal from "sweetalert";

type Turno = {
  tipoTratamiento: string;
  servicio: string;
  fecha: string;
  hora: string;
  informacion?: string;
  costo: number;
  pagoLocal: boolean;
  pagado: boolean;
};
type Tarjeta = {
  numero: string;
  prop: string;
  cuil: string;
  vto: string;
  codigo: string;
};
type Pago = {
  //cliente: Cliente
  cuil: string;
  fecha: string;
  tratamiento: string;
  valor: number;
  pagoLocal: boolean;
};

type Props = {
  DatosTurno: Turno;
};

export default function FormPago({ DatosTurno }: Props) {
  const { activePopUp, closePopUp } = usePopUp();

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

  // Manejador para el envío del formulario
  const onSubmit: SubmitHandler<Tarjeta> = async (tarjeta) => {
    // Crea el objeto tarjeta de reserva
    const pago: Pago = {
      //cliente: Cliente
      cuil: tarjeta.cuil,
      fecha: DatosTurno.fecha,
      tratamiento: DatosTurno.tipoTratamiento,
      valor: DatosTurno.costo,
      pagoLocal: DatosTurno.pagoLocal,
    };

    swal({
      title: "¡Reserva Pagada!",
      text: `Te esperamos en nuestro local pronto`,
      icon: "success",
    });

    console.log("pago", pago); //info del pago AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    console.log("tarjeta", tarjeta); //info de la tarjeta AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    console.log("DatosTurno", DatosTurno); //info del turno AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
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
                Tratamiento: {DatosTurno.tipoTratamiento} ~ Servicio:{" "}
                {DatosTurno.servicio}
              </p>
              <p>
                Fecha: {DatosTurno.fecha} ~ Hora: {DatosTurno.hora} hs
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
