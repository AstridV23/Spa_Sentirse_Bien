import { useLayoutEffect, useState } from "react";
import "./TurnsPage.css";
import TurnPopUp from "../components/Turno";
import PagoPopUp from "../components/FormPago";
import { usePopUp } from "../components/PopUpContext";

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

const misTurnos: Turno[] = [
  {
    tipoTratamiento: "Masaje",
    servicio: "Antiestres",
    fecha: "04/06/2024",
    hora: "18:15",
    informacion: "Masaje relajante de 60 minutos",
    costo: 5000,
    pagoLocal: false,
    pagado: true,
  },
  {
    tipoTratamiento: "Belleza",
    servicio: "Depilacion Facial",
    fecha: "05/06/2024",
    hora: "18:00",
    informacion: "Me pican los cocos",
    costo: 2500,
    pagoLocal: true,
    pagado: false,
  },
  {
    tipoTratamiento: "Facial",
    servicio: "Punta de Diamante",
    fecha: "06/06/2024",
    hora: "17:45",
    costo: 4000,
    pagoLocal: false,
    pagado: false,
  },
  {
    tipoTratamiento: "Masaje",
    servicio: "Antiestres",
    fecha: "07/06/2024",
    hora: "19:00",
    costo: 7500,
    pagoLocal: true,
    pagado: true,
  },
  {
    tipoTratamiento: "Belleza",
    servicio: "Manicura",
    fecha: "08/06/2024",
    hora: "16:30",
    informacion: "Manicura completa con esmaltado",
    costo: 3000,
    pagoLocal: false,
    pagado: false,
  },
  {
    tipoTratamiento: "Facial",
    servicio: "Limpieza Profunda",
    fecha: "09/06/2024",
    hora: "17:00",
    costo: 4500,
    pagoLocal: true,
    pagado: false,
  },
  {
    tipoTratamiento: "Masaje",
    servicio: "Piedras Calientes",
    fecha: "10/06/2024",
    hora: "18:30",
    informacion: "Masaje con piedras calientes",
    costo: 6000,
    pagoLocal: false,
    pagado: false,
  },
  {
    tipoTratamiento: "Belleza",
    servicio: "Pedicura",
    fecha: "11/06/2024",
    hora: "15:45",
    informacion: "Pedicura completa con esmaltado",
    costo: 3500,
    pagoLocal: true,
    pagado: false,
  },
  {
    tipoTratamiento: "Facial",
    servicio: "Hidratación Profunda",
    fecha: "12/06/2024",
    hora: "16:15",
    costo: 5500,
    pagoLocal: false,
    pagado: false,
  },
];

export default function Turn() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { openPopUp } = usePopUp();
  const [DatosTurno, setDatosTurno] = useState<Turno>();

  function handleDatosTurno(turno: Turno) {
    setDatosTurno(turno);
  }
  function handleDelete(turno: Turno) {
    swal({
      title: "¿Estás seguro?",
      text: "No se devolverá el dinero una vez eliminado.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          title: "Turno eliminado",
          icon: "success",
          timer: 1000,
        });
        console.log(turno);
      }
    });
  }

  return (
    <div className="turn-page">
      <div className="background-image" />
      <div className="turn-container">
        <div className="titulo">
          <h1>TURNOS</h1>
          <hr />
        </div>
        <div className="misTurnos">
          <h3>Mis Turnos</h3>
          <div className="misTurnos-container">
            {misTurnos.map((turn, index) => (
              <div className="turno" key={index}>
                <div className="par">
                  <h5>{turn.tipoTratamiento}</h5>
                  <h4>{turn.servicio}</h4>
                </div>
                {turn.informacion && (
                  <p
                    className="info"
                    onClick={() =>
                      swal("Información Importante", turn.informacion || "")
                    }
                    style={{
                      margin: "0 auto",
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "var(--rosa)",
                      opacity: 0.7,
                    }}
                  >
                    Informacion
                  </p>
                )}
                <div className="br" />
                <div className="par">
                  <p>{turn.fecha}</p>
                  <p>{turn.hora}</p>
                  <div className="br" />
                  <input
                    type="submit"
                    className={
                      turn.pagado
                        ? "Pagado"
                        : turn.pagoLocal
                        ? "PorLocal"
                        : "Sinpagar"
                    }
                    value={
                      turn.pagado
                        ? "Pagado"
                        : turn.pagoLocal
                        ? "Por Local"
                        : "Sin pagar"
                    }
                    onClick={() => {
                      if (!turn.pagado) {
                        openPopUp("pago");
                        handleDatosTurno(turn);
                      }
                    }}
                  />
                  <div className="br" />
                  <input
                    type="submit"
                    className="delete"
                    value="Cancelar"
                    onClick={() => handleDelete(turn)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="newTurnButton">
            <button className="MainButton" onClick={() => openPopUp("turn")}>
              Agendar Turno
            </button>
          </div>
          <TurnPopUp />
          {DatosTurno && <PagoPopUp DatosTurno={DatosTurno} />}
        </div>
      </div>
    </div>
  );
}
