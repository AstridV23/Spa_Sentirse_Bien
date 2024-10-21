import { useLayoutEffect, useState, useEffect } from "react";
import "./TurnsPage.css";
import TurnPopUp from "../components/Turno";
import PagoPopUp from "../components/FormPago";
import { usePopUp } from "../components/PopUpContext";
import swal from "sweetalert";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

export default function Turn() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { openPopUp } = usePopUp();
  const { user } = useAuth();
  const [DatosTurno, setDatosTurno] = useState<Turno>();
  const [misTurnos, setMisTurnos] = useState<Turno[]>([]);

  useEffect(() => {
    const fetchPersonalBookings = async () => {
      try {
        const response = await axios.get("/bookings/personal");
        setMisTurnos(response.data);
      } catch (error) {
        console.error("Error al obtener las reservas personales", error);
        swal({
          title: "Error",
          text: "No se pudieron cargar tus reservas. Inténtalo de nuevo.",
          icon: "error",
        });
      }
    };

    if (user) {
      fetchPersonalBookings();
    }
  }, [user]);

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
            {misTurnos.length > 0 ? (
              misTurnos.map((turn) => (
                <div className="turno" key={turn._id}>
                  <div className="par">
                    <h5>{turn.treatment}</h5>
                    <h4>{turn.service}</h4>
                  </div>
                  {turn.info && (
                    <p
                      className="info"
                      onClick={() =>
                        swal("Información Importante", turn.info || "")
                      }
                      style={{
                        margin: "0 auto",
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
                    <p>
                      {new Date(
                        new Date(turn.date).getTime() + 86400000
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <div className="br" />
                    <input
                      type="submit"
                      className={
                        turn.status === "pagado"
                          ? "Pagado"
                          : turn.status === "reservado"
                          ? "Sinpagar"
                          : "Sinpagar"
                      }
                      value={
                        turn.status === "pagado"
                          ? "Pagado"
                          : turn.status === "reservado"
                          ? "Sin pagar"
                          : "Sin pagar"
                      }
                      onClick={() => {
                        if (turn.status !== "pagado") {
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
              ))
            ) : (
              <p>No tienes turnos reservados.</p>
            )}
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
